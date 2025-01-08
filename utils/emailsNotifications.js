import  sgMail from "@sendgrid/mail"

async function sendEmailConfirmation(EmailDestination, url, username) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: [{ email: EmailDestination }], // Reemplaza con el destinatario
    from: "roilan.armenteros@galmasoft.com", // Reemplaza con tu correo remitente
    templateId: "d-ab41b489c41d4241937271c349f72468", // El ID del template
    dynamic_template_data: {
      urlcode: url,
      name: username.toUpperCase(),
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error(
      "Error enviando el correo",
      error.response ? error.response.body : error
    );
  }
}

async function sendEmailPassConfirmation(EmailDestination, url, username) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: [{ email: EmailDestination }], // Reemplaza con el destinatario
    from: "roilan.armenteros@galmasoft.com", // Reemplaza con tu correo remitente
    templateId: "d-89d391492c8b4ec3be4ad3fb72be5739", // El ID del template
    dynamic_template_data: {
      urlcode: url,
      name: username.toUpperCase(),
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error(
      "Error enviando el correo",
      error.response ? error.response.body : error
    );
  }
}

async function sendEmailBienvenida(EmailDestination, username) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: [{ email: EmailDestination }], // Reemplaza con el destinatario
    from: "roilan.armenteros@galmasoft.com", // Reemplaza con tu correo remitente
    templateId: "d-342497a6e2a14c2194a9a05cc1e9927e", // El ID del template
    dynamic_template_data: {
      name: username.toUpperCase(),
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error(
      "Error enviando el correo",
      error.response ? error.response.body : error
    );
  }
}

async function sendEmailChallengeComprado(
  EmailDestination,
  username,
  challengename
) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: [{ email: EmailDestination }], // Reemplaza con el destinatario
    from: "roilan.armenteros@galmasoft.com", // Reemplaza con tu correo remitente
    templateId: "d-d9c4bab70e4f42018cfe250b70eaebb2", // El ID del template
    dynamic_template_data: {
      name: username.toUpperCase(),
      challengename: challengename,
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error(
      "Error enviando el correo",
      error.response ? error.response.body : error
    );
  }
}

async function sendEmailNuevoReferido(EmailDestination, username) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: [{ email: EmailDestination }], // Reemplaza con el destinatario
    from: "roilan.armenteros@galmasoft.com", // Reemplaza con tu correo remitente
    templateId: "d-13dfa44bd11549deb2e30ee4a31aebd2", // El ID del template
    dynamic_template_data: {
      name: username.toUpperCase(),
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error(
      "Error enviando el correo",
      error.response ? error.response.body : error
    );
  }
}

export const emailsNotifications =  {
  sendEmailConfirmation,
  sendEmailBienvenida,
  sendEmailChallengeComprado,
  sendEmailNuevoReferido,
  sendEmailPassConfirmation,
};
