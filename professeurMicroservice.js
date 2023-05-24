const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const clientmatieres = require("./apiGateway.js").clientmatieres;
const professeurProtoPath = "professeur.proto";
const professeurProtoDefinition = protoLoader.loadSync(professeurProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const professeurProto = grpc.loadPackageDefinition(
  professeurProtoDefinition
).professeur;
const professeurs = [
  {
    id: "1",
    name: "Example Professeur 1",
    matiere: {
      id: "1",
      title: "Example matiere 2",
      description: "This is the second example matiere.",
    },
  },
  {
    id: "2",
    name: "Example Professeur 2",
    matiere: {
      id: "2",
      title: "Example matiere 2",
      description: "This is the second example matiere.",
    },
  },
];
let global_id = professeurs.length;

const professeurService = {
  getProfesseur: (call, callback) => {
    const professeur = {
      id: call.request.professeur_id,
      name: professeurs[call.request.professeur_id].name,
      matiere: professeurs[call.request.professeur_id].description,
    };
    callback(null, { professeur });
  },
  searchProfesseurs: (call, callback) => {
    const { query } = call.request;

    callback(null, { professeurs });
  },

  createProfesseur: (call, callback) => {
    const { query } = call.request;
    const professeur = {
      id: ++global_id,
      name: call.request.name,
      matiere: {},
    };
    clientmatieres.getmatiere(
      { matiere_id: call.request.matiere_id },
      (err, response) => {
        if (!err) {
          professeur.matiere = response.matiere;
          professeurs.push(professeur);
          callback(null, { professeur });
        } else {
          callback(null, { professeur });
        }
      }
    );
  },
  deleteProfesseur: (call, callback) => {
    const { query } = call.request;
    const professeur = {
      id: call.request.professeur_id,
    };
    const delete_id = professeurs.indexOf(
      professeurs.find((element) => element.id == professeur.id)
    );
    professeurs.splice(delete_id, 1);
    callback(null, { professeur });
  },
  /*
  updateProfesseur: (call, callback) => {
    console.log(call.request.professeur_id);

    const professeur = {
      id: call.request.professeur_id,
      title: call.request.title,
      description: call.request.description
  
    };
    console.log(professeur);
    professeurs[call.request.professeur_id] = professeur;
    callback(null, {professeur});
  },

  deleteProfesseur: (call, callback) => {
    const { query } = call.request;
    const professeur = {
      id: call.request.professeur_id,

    };
    console.log(professeur);
    professeurs.pop(professeur);
    callback(null, {professeur});
  }
*/
};

const server = new grpc.Server();
server.addService(professeurProto.ProfesseurService.service, professeurService);
const port = 50053;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }

    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
console.log(`Professeur microservice running on port ${port}`);
