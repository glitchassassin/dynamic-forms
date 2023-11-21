import { ObjectId } from "mongodb";
import { db } from "./index.server";

interface FormSchema {
  _id?: string;
  name: string;
  schema: string;
  uiSchema: string;
}

/**
 * Get a form schema by ID, or return the first one
 */
export async function getFormSchema(id: string): Promise<FormSchema | null> {
  const formsCollection = db.collection("forms");
  const formSchema = await formsCollection.findOne<FormSchema>({
    _id: new ObjectId(id),
  });
  if (!formSchema) return formSchema;
  return {
    ...formSchema,
    _id: formSchema?._id?.toString(),
  };
}

/**
 * Get a form schema by ID, or return the first one
 */
export async function getFormSchemaList(): Promise<
  Pick<FormSchema, "_id" | "name">[]
> {
  const formsCollection = db.collection("forms");
  const cursor = formsCollection.find<Pick<FormSchema, "_id" | "name">>(
    {},
    { projection: { _id: 1, name: 1 } }
  );
  return await cursor.toArray();
}

export async function setFormSchema(
  form: FormSchema
): Promise<FormSchema | null> {
  const formsCollection = db.collection("forms");
  const { _id, ...rest } = form;
  if (_id) {
    await formsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: rest });
    return form;
  } else {
    const result = await formsCollection.insertOne(rest);
    return {
      _id: result.insertedId.toString(),
      ...form,
    };
  }
}
