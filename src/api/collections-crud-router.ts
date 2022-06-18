import { Router, Request, Response, Express, NextFunction } from 'express';
import { Filter, ObjectId } from 'mongodb';
import Repository from '../db/repository';

const collectionsCrudRouter = <TModel extends { _id?: ObjectId, tenantId: string }>() => {
  async function GetAll(req: Request, res: Response) {
    const collection = req.params.collection;
    const repo = new Repository<TModel>(collection);
    const objs = await repo.all({ tenantId: req.user.sub }, { name: 1 });

    res.json(objs);
  }

  async function Get(req: Request, res: Response) {
    const collection = req.params.collection;
    const getObjectId = req.params['id'];

    const repo = new Repository<TModel>(collection);
    const obj = await repo.get({ _id: new ObjectId(getObjectId), tenantId: req.user.sub } as Filter<TModel>);

    res.json(obj);
  }

  async function Create(req: Request, res: Response) {
    const collection = req.params.collection;
    const createObject = <TModel>req.body;
    createObject.tenantId = req.user.sub;

    const repo = new Repository<TModel>(collection);
    await repo.insert(createObject);

    res.sendStatus(200);
  }

  async function Update(req: Request, res: Response) {
    const collection = req.params.collection;
    const updateObjectId = req.params['id'];
    const updateObject = <TModel>req.body;

    const repo = new Repository<TModel>(collection);
    await repo.update(
      { _id: new ObjectId(updateObjectId), tenantId: req.user.sub } as Filter<TModel>,
      { $set: updateObject }
    );

    res.json(updateObject);
  }

  async function Delete(req: Request, res: Response) {
    const collection = req.params.collection;
    const deleteObjectId = req.params['id'];

    const repo = new Repository<TModel>(collection);
    await repo.remove({ _id: new ObjectId(deleteObjectId), tenantId: req.user.sub } as Filter<TModel>);

    res.sendStatus(200);
  }

  
  return (app: Express) => {
    const router = Router();

    router.post('/:collection/create', Create);
    router.patch('/:collection/update/:id', Update);
    router.delete('/:collection/delete/:id', Delete);
    router.get('/:collection/:id', Get);
    router.get('/:collection', GetAll);

    app.use('/', router);
  }
};

export default collectionsCrudRouter();
