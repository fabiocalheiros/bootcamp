import Api from '../../services/api';

const { projects } = Api;

class ProjectsController {
  async index(req, res) {
    return res.json(projects);
  }

  async store(req, res) {
    projects.push(req.body);

    return res.json(projects);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;

    const objIndex = projects.findIndex(obj => obj.id === id);
    projects[objIndex].title = title;

    return res.json(projects);
  }

  async delete(req, res) {
    const { id } = req.params;

    const objIndex = projects.findIndex(obj => obj.id === id);
    projects.splice(objIndex, 1);

    return res.json(projects);
  }

  async storeTask(req, res) {
    const { id } = req.params;

    const objIndex = projects.findIndex(obj => obj.id === id);

    const { title } = req.body;

    projects[objIndex].tasks.push(title);

    return res.json(projects);
  }
}

export default new ProjectsController();
