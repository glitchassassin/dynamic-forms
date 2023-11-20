import { ObjectId } from "mongodb";
import { db } from "./index.server";

interface FormSubmission {
  _id?: string;
  schema: string;
  data: string;
}

/**
 * Get a form schema by ID, or return the first one
 */
export async function getFormSubmission(
  id: string
): Promise<FormSubmission | null> {
  const submissions = db.collection("formSubmissions");
  let formSubmission;
  if (id) {
    formSubmission = await submissions.findOne<FormSubmission>({
      _id: new ObjectId(id),
    });
  } else {
    formSubmission = await submissions.findOne<FormSubmission>();
  }
  if (!formSubmission) return formSubmission;
  return {
    ...formSubmission,
    _id: formSubmission?._id?.toString(),
  };
}

export async function setFormSubmission(
  form: FormSubmission
): Promise<FormSubmission | null> {
  const submissions = db.collection("formSubmissions");
  const { _id, ...rest } = form;
  if (_id) {
    await submissions.updateOne({ _id: new ObjectId(_id) }, { $set: rest });
    return form;
  } else {
    const result = await submissions.insertOne(rest);
    return {
      _id: result.insertedId.toString(),
      ...form,
    };
  }
}
