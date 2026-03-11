import axios from "axios";

const SYSTEME_API = "https://api.systeme.io/api/contacts";

export const createSystemeContact = async (name, email) => {
  try {
    const response = await axios.post(
      SYSTEME_API,
      {
        email: email,
        fields: [
          {
            slug: "first_name",
            value: name
          }
        ]
      },
      {
        headers: {
            "X-API-Key": process.env.SYSTEME_API_KEY,
            "Content-Type": "application/json",
        }
      }
    );

    const contactId = response.data.id;
    console.log("Systeme contact created:", contactId);

    await axios.post(
        `https://api.systeme.io/api/contacts/${contactId}/tags`,
        {
          tagId: 1908817
        },
        {
          headers: {
            "X-API-Key": process.env.SYSTEME_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
  } catch (error) {
    console.error("Error creating Systeme contact:", error.message);
  }
};