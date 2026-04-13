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

  } catch (error) {
    console.error("Error creating Systeme contact:", error.message);
  }
};

export const addTagToSystemeContactByEmail = async (email, tagId) => {
  try {
    const searchResponse = await axios.get(
      `${SYSTEME_API}?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "X-API-Key": process.env.SYSTEME_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const contact = searchResponse.data?.items?.[0];

    if (!contact) {
      console.error(`Systeme contact not found for email: ${email}`);
      return;
    }

    await axios.post(
      `https://api.systeme.io/api/contacts/${contact.id}/tags`,
      {
        tagId,
      },
      {
        headers: {
          "X-API-Key": process.env.SYSTEME_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Tag ${tagId} added to Systeme contact: ${email}`);
  } catch (error) {
    console.error("Error adding tag to Systeme contact:", error.message);
  }
};

export const removeTagFromSystemeContactByEmail = async (email, tagId) => {
  try {
    const searchResponse = await axios.get(
      `${SYSTEME_API}?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "X-API-Key": process.env.SYSTEME_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const contact = searchResponse.data?.items?.[0];

    if (!contact) {
      console.error(`Systeme contact not found for email: ${email}`);
      return;
    }

    await axios.delete(
      `https://api.systeme.io/api/contacts/${contact.id}/tags/${tagId}`,
      {
        headers: {
          "X-API-Key": process.env.SYSTEME_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Tag ${tagId} removed from Systeme contact: ${email}`);
  } catch (error) {
    console.error("Error removing tag from Systeme contact:", error.message);
  }
};

export const updateSystemeContactFieldsByEmail = async (
  email,
  sessionDate,
  sessionStart,
  sessionEnd,
  sessionType
) => {
  try {
    const searchResponse = await axios.get(
      `${SYSTEME_API}?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "X-API-Key": process.env.SYSTEME_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const contact = searchResponse.data?.items?.[0];

    if (!contact) {
      console.error(`Systeme contact not found for email: ${email}`);
      return;
    }

    await axios.patch(
      `https://api.systeme.io/api/contacts/${contact.id}`,
      {
        fields: [
          {
            slug: "session_date",
            value: sessionDate,
          },
          {
            slug: "session_start",
            value: sessionStart,
          },
          {
            slug: "session_end",
            value: sessionEnd,
          },
          {
            slug: "session_type",
            value: sessionType,
          },
        ],
      },
      {
        headers: {
          "X-API-Key": process.env.SYSTEME_API_KEY,
          "Content-Type": "application/merge-patch+json",
        },
      }
    );

    console.log(`Systeme custom fields updated for: ${email}`);
  } catch (error) {
    console.error(
      "Error updating Systeme custom fields:",
      error.response?.data || error.message
    );
  }
};