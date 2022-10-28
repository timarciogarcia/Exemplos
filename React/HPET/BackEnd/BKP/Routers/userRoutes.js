const router = require("express").Router();
const sequelize = require("../DataBase/db");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

// função da verificação do token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['x-access-token'];
    jwt.verify(bearerHeader, process.env.SECRET, (err, authData) => { 
        if (err) {return res.sendStatus(401);            
        } else {
            req.user_id = authData.user_id;
            next();
        }
    })
}

//Rota para listar todos os usuários
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users || users.length === 0) {
      res
        .status(404)
        .json({ message: "Não existe nenhum registro cadastrado" });
      return;
    }
    res.send(users);
    return;
  } catch (err) {
    res.send({ error: err.message });
  }
});

//Rota para listar um usuário específico
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
      return;
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ error: "Houve um erro na busca, verifique !!!" });
  }
});

//Rota para listar um email específico
router.get("/email/:email", verifyToken, async (req, res) => {
  try {
    const user = await User.findAll(req.params.email);
    if (!user) {
      res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
      return;
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ error: "Houve um erro na busca, verifique !!!" });
  }
});

//Rota pra listar usuario por nome
router.get("/name/:name", verifyToken, async (req, res) => {
  try {
    const userGet = 
    await User.sequelize.query(
      `SELECT * FROM rhusuarios WHERE name LIKE '%${req.params.name}%'`
      )
    if (!userGet || userGet[0].length === 0) {
      res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
      return;
    }
    res.send(userGet[0]);
  }
  catch (err) {
    res.status(400).send({ error: "Houve um erro na busca, verifique !!!" });    
  }
});

//Rota para Criar um usuário
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!(req.body.name || !req.body.email || !req.body.password)) {
      res.status(404).json({ message: "Existe(m) campo(s) vazio(s)" });
      return;
    }
    const ChekUser = await User.findOne({ where: { email: req.body.email } });
    if (ChekUser) {
      res.status(404).json({ message: "Email já cadastrado" });
      return;
    }

    const user = await User.create(req.body);
    res.status(201).send(user);
    return;
  } catch (err) {
      res.send({ error: err.message });
      };
});

//Rota para atualizar um usuário específico
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!(req.body.name || !req.body.email || !req.body.password)) {
      res.status(404).json({ message: "Existe(m) campo(s) vazio(s)" });
      return;
    }
    if (!user) {
      res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
      return;
    }
    await user.update(req.body);
    res.send(user);
    return;
  } catch (err) {
    res
      .status(400)
      .send({ error: "Houve um erro na atualização, verifique !!!" });
  }
});

//Rota para deletar um usuário específico
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
      return;
    }
    const userDelete = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.send({ message: "Registro deletado com sucesso" });
    return;

  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//Rota para Buscar o menu correspondente ao usuario logado do usuário  
router.post("/menu", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      res.status(404).send({ error: "Usuário não encontrado, verifique !!!" });
      return;
    }
    //if (user.password !== req.body.password) {
    //  res.status(404).send({ error: "Senha incorreta, verifique !!!" });
    //  return;
    //}

    const menuSearch = await sequelize.query(
      `SELECT * from hpet.rhusuario_menuacessos 
      right join hpet.rhusuarios on hpet.rhusuario_menuacessos.rhusuarios_id = hpet.rhusuarios.id
      right join hpet.adsubmenu on hpet.rhusuario_menuacessos.adsubmenu_id = hpet.adsubmenu.id
      right join hpet.admenu on hpet.adsubmenu.admenu_id = hpet.admenu.id
      where hpet.rhusuarios.id=${user.id}
      order by hpet.admenu.ordem`
    );

    res.send(menuSearch[0]);
    return;
  } catch (err) {
    res.status(400).send({ error: "Menu do usuario e seu config não encontrado !!!" });
  }
});

//Rota de post para checar o userid e password e gerar o token de autenticação JWT e retornar o usuario
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      res.status(404).send({ error: "Usuário não encontrado, verifique !!!" });
      return;
    }
    if (user.password !== req.body.password) {
      res.status(404).send({ error: "Senha incorreta, verifique !!!" });
      return;
    }
    const token = jwt.sign({ user_id: user.id }, process.env.SECRET, {
      expiresIn: "1d"
    });
    res.send({ user, token });

    return;
  } catch (err) {
    res.status(400).send({ error: "Usuário e senha não encontrado !!!" });
  }
});

module.exports = router;
