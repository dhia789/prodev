const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const matiereProtoPath = "matiere.proto";
const professeurProtoPath = "professeur.proto";
const tvShowProtoPath = "tvShow.proto";

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const app = express();
app.use(bodyParser.json());

const matiereProtoDefinition = protoLoader.loadSync(matiereProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const professeurProtoDefinition = protoLoader.loadSync(professeurProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const matiereProto = grpc.loadPackageDefinition(matiereProtoDefinition).matiere;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;
const professeurProto = grpc.loadPackageDefinition(
  professeurProtoDefinition
).professeur;

const clientMatieres = new matiereProto.MatiereService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const clientTVShows = new tvShowProto.TVShowService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
const clientProfesseurs = new professeurProto.ProfesseurService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get("/matieres", (req, res) => {
  clientMatieres.searchMatieres({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.matieres);
    }
  });
});

app.post("/matiere", (req, res) => {
  const { id, title, description } = req.body;
  clientMatieres.createMatiere(
    { matiere_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.matiere);
      }
    }
  );
});

app.put("/matieres/:id", (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  clientMatieres.updateMatiere(
    { matiere_id: id, title: title, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.matiere);
      }
    }
  );
});

app.delete("/matieres/:id", (req, res) => {
  const id = req.params.id;
  clientMatieres.deleteMatiere({ matiere_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.matiere);
    }
  });
});

app.get("/matieres/:id", (req, res) => {
  const id = req.params.id;
  clientMatieres.getMatiere({ matiere_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.matiere);
    }
  });
});

app.get("/professeurs", (req, res) => {
  clientProfesseurs.searchProfesseurs({}, (err, response) => {
    console.log(response);
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.professeurs);
    }
  });
});

app.delete("/professeurs/:id", (req, res) => {
  const id = req.params.id;
  clientProfesseurs.deleteProfesseur({ professeur_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.professeur);
    }
  });
});

app.post("/professeur", (req, res) => {
  const { id, name, matiere_id } = req.body;
  clientProfesseurs.createProfesseur(
    { professeur_id: id, name: name, matiere_id: matiere_id },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.matiere);
      }
    }
  );
});

app.get("/tvshows", (req, res) => {
  clientTVShows.searchTvshows({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_shows);
    }
  });
});

app.get("/tvshows/:id", (req, res) => {
  const id = req.params.id;
  clientTVShows.getTvshow({ tvShowId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_show);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
module.exports.clientMatieres = clientMatieres;
