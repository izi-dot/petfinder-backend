// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for Angular app
app.use(cors());
app.use(express.json());

// Example API endpoint
app.get('/api/posts', (req, res) => {
  res.json([
    {
      id: "123",
      createdBy: "Martinko",
      createAt: new Date(Date.now()).toLocaleString(),
      petName: "LEO",
      location: "Dunajska Streda",
      photos: "https://media.tenor.com/lwumhdMpAVkAAAAe/a.png",
      intractionsCount: 67,
      solved: true
    },
    {
      id: "4",
      createdBy: "Jozo Kubani",
      createAt: new Date(1734977093).toLocaleString(),
      petName: "Zoltan",
      location: "Mala Fatra",
      photos: "https://images.ctfassets.net/ub3bwfd53mwy/5WFv6lEUb1e6kWeP06CLXr/acd328417f24786af98b1750d90813de/4_Image.jpg?w=750",
      intractionsCount: 69,
      solved: false
    },
    {
      id: "5",
      createdBy: "Jozu kubani",
      createAt: new Date(1734977093).toLocaleString(),
      petName: "Marta",
      location: "Brunovce",
      photos: "https://dogwoodanimalhospital.com/wp-content/uploads/2025/07/img-cute-cat-breeds-you-probably-never-heard-of.webp",
      intractionsCount: 911,
      solved: false
    }
  ]);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});