import { Router, Request, Response, Express } from 'express';
import { Filter, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import { getCollection } from '../db/mongodb';

const collectionsCrudRouter = <TModel extends { _id?: ObjectId, tenantId: string }>() => {
  
  async function GetAll(req: Request, res: Response) {
    const collection = getCollection(req.params.collection);

    const objs = await collection
      .find({ tenantId: req.user.sub })
      .toArray();

    res.json(objs);
  }

  async function Get(req: Request, res: Response) {
    const collection = getCollection(req.params.collection);

    const targetId = req.params['id'];

    const obj = await collection.findOne({ _id: new ObjectId(targetId), tenantId: req.user.sub } as Filter<TModel>);

    res.json(obj);
  }

  async function Create(req: Request, res: Response) {
    const collection = getCollection(req.params.collection);

    const createObject = <TModel>req.body;
    createObject.tenantId = req.user.sub;

    await collection.insertOne(<OptionalUnlessRequiredId<TModel>>(createObject));

    res.sendStatus(200);
  }

  async function Update(req: Request, res: Response) {
    const collection = getCollection(req.params.collection);

    const updateObjectId = req.params['id'];
    const updateObject = <TModel>req.body;

    const updatedObject = await collection.findOneAndUpdate(
      { _id: new ObjectId(updateObjectId), tenantId: req.user.sub } as Filter<TModel>,
      { $set: updateObject },
      { returnDocument: 'after' }
    );

    if (updatedObject.ok) {
      res.json(updatedObject.value);
    } else {
      res.sendStatus(400);
    }
  }

  async function Delete(req: Request, res: Response) {
    const collection = getCollection(req.params.collection);
  
    const deleteObjectId = req.params['id'];
    await collection.deleteMany({ _id: new ObjectId(deleteObjectId), tenantId: req.user.sub } as Filter<TModel>);

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
