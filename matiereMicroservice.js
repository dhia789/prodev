const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const matiereProtoPath = "matiere.proto";
const matiereProtoDefinition = protoLoader.loadSync(matiereProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const matiereProto = grpc.loadPackageDefinition(matiereProtoDefinition).matiere;

const matieres = [
  {
    id: "1",
    title: "Example Matiere 1",
    description: "This is the first example matiere.",
  },
  {
    id: "2",
    title: "Example Matiere 2",
    description: "This is the second example matiere.",
  },
];

let global_id = matieres.length;

const matiereService = {
  getMatiere: (call, callback) => {
    const update_id = matieres.indexOf(
      matieres.find((element) => element.id == call.request.matiere_id)
    );
    const matiere = {
      id: call.request.matiere_id,
      title: matieres[update_id].title,
      description: matieres[update_id].description,
    };
    callback(null, { matiere });
  },

  searchMatieres: (call, callback) => {
    const { query } = call.request;
    callback(null, { matieres });
  },

  createMatiere: (call, callback) => {
    const { query } = call.request;
    const matiere = {
      id: ++global_id,
      title: call.request.title,
      description: call.request.description,
    };
    matieres.push(matiere);
    callback(null, { matiere });
  },

  updateMatiere: (call, callback) => {
    const matiere = {
      id: call.request.matiere_id,
      title: call.request.title,
      description: call.request.description,
    };
    const update_id = matieres.indexOf(
      matieres.find((element) => element.id == matiere.id)
    );
    matieres[update_id] = matiere;
    callback(null, { matiere });
  },

  deleteMatiere: (call, callback) => {
    const { query } = call.request;
    const matiere = {
      id: call.request.matiere_id,
    };
    const delete_id = matieres.indexOf(
      matieres.find((element) => element.id == matiere.id)
    );
    matieres.splice(delete_id, 1);
    callback(null, { matiere });
  },
};

const server = new grpc.Server();
server.addService(matiereProto.MatiereService.service, matiereService);
const port = 50051;
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
console.log(`Matiere microservice running on port ${port}`);
