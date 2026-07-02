import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = "mongodb://kotadogpetclinic_db_user:MdKB50Tqn72PPAwL@ac-onnfx9l-shard-00-00.570vyag.mongodb.net:27017,ac-onnfx9l-shard-00-01.570vyag.mongodb.net:27017,ac-onnfx9l-shard-00-02.570vyag.mongodb.net:27017/?ssl=true&replicaSet=atlas-eppo1r-shard-0&authSource=admin&appName=Dogpet";

async function check() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("test");
    const medicalRecordsColl = db.collection("medicalrecords");

    const patient_id = "6a09826b4f7688b73b918a96";
    const pet_id = "6a09826b4f7688b73b918a96";
    const phone = "7425822658";

    // Simulate our proposed query logic
    const isPrimaryOrLegacy = pet_id === patient_id; // in this case it is true

    let query = {};
    if (pet_id) {
      if (isPrimaryOrLegacy) {
        query = {
          $or: [
            { pet_id: new ObjectId(pet_id) },
            { pet_id: pet_id }, // string version just in case
            {
              pet_id: { $in: [null, undefined] },
              $or: [
                { patient_id: new ObjectId(patient_id) },
                { patient_id: patient_id },
                { phone, patient_id: { $exists: false } },
              ],
            },
          ],
        };
      } else {
        query = {
          $or: [
            { pet_id: new ObjectId(pet_id) },
            { pet_id: pet_id }
          ]
        };
      }
    }

    console.log("Constructed query:", JSON.stringify(query, null, 2));

    const records = await medicalRecordsColl.find(query).toArray();
    console.log(`Matched records count: ${records.length}`);
    if (records.length > 0) {
      console.log("First matched record sample:", JSON.stringify(records[0], null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

check().catch(console.error);
