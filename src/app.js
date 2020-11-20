const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorie(request, response, next){
  const {id} = request.params;

  if(!uuid(id)){
    return response.status(400).json({error: 'Invalid repositorie ID ☹'});
  }
  return next();
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs=[]} = request.body;
  const { likes = 0} = request.params;
  const repositorie = { id:uuid(), title, url, techs, likes};

  repositories.push(repositorie);
  return response.json(repositorie);
});

app.put("/repositories/:id",validateRepositorie,(request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if(repositorieIndex < 0){
    return response.status(400).json({ error: "Repositorie not found ☹ "});
  }

  const prerepositorie = repositories[repositorieIndex];

  const likes = prerepositorie.likes;

  const repositorie = {id, title, url, techs, likes};

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie);
});

app.delete("/repositories/:id",validateRepositorie, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if(repositorieIndex < 0){
    return response.status(400).json({ error: "Repositorie not found ☹ "});
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like",validateRepositorie, (request, response) => {
  /*Foi configurado segundo a proposta de ser uma nova entendidade onde apenas o ID e o numero de likes estão presentes */
  const { id } = request.params;
  let { title, url, techs, likes } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if(repositorieIndex < 0){
    return response.status(400).json({ error: "Repositorie not found ☹ "});
  }

  let repositorie = repositories[repositorieIndex];

  likes =  repositorie.likes+=1;

  repositorie = repositories[repositorieIndex];

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
