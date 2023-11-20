import { ObjectId } from "mongodb";
import { db } from "./index.server";

interface FormSchema {
  _id?: string;
  name: string;
  schema: string;
}

/**
 * Get a form schema by ID, or return the first one
 */
export async function getFormSchema(id?: string): Promise<FormSchema | null> {
  const formsCollection = db.collection("forms");
  let formSchema;
  if (id) {
    formSchema = await formsCollection.findOne<FormSchema>({
      _id: new ObjectId(id),
    });
  } else {
    formSchema = await formsCollection.findOne<FormSchema>();
  }
  if (!formSchema) return formSchema;
  return {
    ...formSchema,
    _id: formSchema?._id?.toString(),
  };
}

export async function setFormSchema(
  form: FormSchema
): Promise<FormSchema | null> {
  const formsCollection = db.collection("forms");
  console.log("setting", form);
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
