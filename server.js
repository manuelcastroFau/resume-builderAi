const express = require('express')
const bodyParser = require("body-parser");

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// OpenAi configuration and setup 
const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// app.get('/', function (req, res) {
//     res.sendFile("/index.html");
// })
app.get('/', function (req, res) {
    res.sendFile(__dirname +"/public/user-data.html");
})

app.get('/manuel', async function  (req, res) {
    const myAi = await chatCompletion("Do me a resume for entry level sofware engineer, my name is manuel castro, my email is manuelcastro2021@fau.edu, my university is Florida Atlantic University, and my phone number is 786-1234466, graduation date summer 2023");
    console.log()
    res.send( myAi)
})

app.post('/resume', async function  (req, res) {
    let user ={
        name:req.body.name,
        position:req.body.position,
        university:req.body.university,
        graduation:req.body.graduation,
        phone:req.body.phone,
        email:req.body.email
    }

    const myAi = await chatCompletion(`Do me a resume for ${user.position}, my name is ${user.name}, my email is ${user.email}, my university is ${user.university}, and my phone number is ${user.phone}, graduation date ${user.graduation}`);
    console.log()
    res.send( myAi)
})


async function chatCompletion(message) {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
        temperature: 0.7,
    });
    //createPDF().catch((error) => console.log(error));
    const pdf = await createPDF(response.data.choices[0].message.content);
    console.log()
    console.log(response.data.choices[0].message.content);
    return {
        resumetext:response.data.choices[0].message.content,
        resumePDF: pdf
    };
    //return response
}

const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function createPDF(text) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page
  const page = pdfDoc.addPage();

  // Set the font and font size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  // Set the text color
  const textColor = rgb(0, 0, 0); // Black color

  // Define the text content
  const textContent = text;

  // Add the text content to the page
  page.drawText(textContent, {
    x: 50,
    y: page.getHeight() - 50,
    font,
    fontSize,
    
    color: textColor,
  });

  // Save the PDF document to a buffer
  const pdfBytes = await pdfDoc.save();

  // Write the buffer to a file
  const fs = require('fs');
  fs.writeFileSync(__dirname +"/public/resume.pdf", pdfBytes);
  return pdfBytes;
}



const PORT = 3000 || process.env.PORT
console.log("Server running in port: ", PORT)
app.listen(3000)
