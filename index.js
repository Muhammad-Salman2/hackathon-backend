import express, { response } from "express";
import cors from "cors";
import 'dotenv/config'
import "./database.js";
import { Todo } from "./models/index.js";

const app = express();
const port = process.env.PORT || 5001;

// const todos = [];

app.use(express.json()); //to convert body into json
app.use(cors({ origin: ["http://localhost:5173"] }));

app.get("/api/v1/todos", async (request, response) => {
  try {
    const todos = await Todo.find(
      {},
      {todoContent: 1} //projection
      //{ todocontent: 0, ip: 0, _v: 0 } //( 0 wale frontend pr show nhi honge)
      // projection hum is lia use krte hen ksi ko frontend pr show kr he ya nahi karna.
      //{todoContent: 1 , id: 0 } // advance siruf id me difference keys use ho sakti he. 1 wale sirf frontend pr show honge ( 0 or 1 ek heme use nahi hoskte sivae "id" k )
    ).sort({ _id: -1 }) // ye sorting kehlati -1 se letest todos uper aynge // dosra 1 hota he jo 1 me alphabetically sort hota he 

    // console.log(todos);
    const message = !todos.length ? "todos empty" : "data fetched succesfully";
    // console.log(message);

    response.send({ data: todos, message: message });
  } catch (error) {
    response.status(500).send("internal server error");
  }
});

// ye api todo add krne k lea he
app.post("/api/v1/todo", async (request, response) => {
  try {
    const object = {
      todoContent: request.body.todo
      // ip: request.ip,
    };

    const result = await Todo.create(object);

    response.send({ messege: "todo added succesfully", data: result });
  } catch (error) {
    response.send(error);
  }
});

// ye api todo update ya edit krne k lea he
app.patch("/api/v1/todo/:id", async (request, response) => {
  try {
    const id = request.params.id;

    const result = await Todo.findByIdAndUpdate(id, {
      todoContent: request.body.todoContent
    },
   //{ new: true } // Yeh option updated document return karega
  );
    // console.log("ye result he ", result);
    if (result) {
      response.status(201).send({
        data: result,
        messege: "todo updated succesfully",
      });
    } else {
      response.status(200).send({ data: null, messege: "todo not found!" });
    }
  } catch (error) {
    response.status(404).send("id not found!");
  }
});

// is api id k zerye koi khas todo ko delete krne k lea he
app.delete("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  const result = await Todo.findByIdAndDelete(id);

  if (result) {
    response.status(201).send({
      // data: {todoContent: request.body.todoContent,id: id,},
      message: "todo deleted succesfully",
    });
  } else {
    response.status(200).send({ data: null, message: "todo not found!" });
  }
});

// ager uper wale routes me se koi route nhi milta t ye route lazmi chale ga
app.use((request, response) => {
  response.status(404).send({ message: "route not found!" });
});

// ye port k apna seen he
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
