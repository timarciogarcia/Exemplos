const router = require("express").Router();
const sequelize = require("../DataBase/db");
const User = require("../Models/user");
const rhsessions = require("../Models/rhsessions");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

function criptografar(texto) {
  var cripto = cryptojs.AES.encrypt(texto, process.env.CRYPTO_SECRET);
  return cripto.toString();
}
function descriptografar(texto) {
  var descripto = cryptojs.AES.decrypt(texto, process.env.CRYPTO_SECRET);
  return descripto.toString(cryptojs.enc.Utf8);
}
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
router.get("/",  async (req, res) => {
  try {
    //const users = await User.findAll();
    const users = await sequelize.query(
      "SELECT SUBSTR(rhusuarios.name,1,29) as name, SUBSTR(rhusuarios.email,1,25) as email, SUBSTR(rhusuarios.celphone,1,13) as celphone, rhusuarios.password, rhusuarios.rhcargo_id, rhusuarios.rhdepartamento_id, SUBSTR(rhcargo.name,1,20) as cargo, SUBSTR(rhdepartamento.name,1,20) as depto FROM hpet.rhusuarios " +
      " inner join rhcargo on rhcargo.id = rhusuarios.rhcargo_id " +
      " inner join rhdepartamento on rhdepartamento.id = rhusuarios.rhdepartamento_id " +
      " ORDER BY rhusuarios.name ASC"
    );
    if (!users || users.length === 0) {
      res
        .status(404)
        .json({ message: "Não existe nenhum registro cadastrado" });
      return;
    }
    res.send(users[0]);
    return;
  } catch (err) {
    res.send({ error: err.message });
  }
});

//Rota para listar um usuário específico
router.get("/:id",  async (req, res) => {
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
router.get("/email/:email",  async (req, res) => {
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
router.get("/name/:name",  async (req, res) => {
  try {
    const userGet = 
    await User.sequelize.query(
      `SELECT * FROM rhusuarios WHERE name LIKE '%${req.params.name}%' ORDER BY name ASC`
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
router.post("/",  async (req, res) => {
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
router.put("/:id",  async (req, res) => {
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
router.delete("/:id",  async (req, res) => {
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
router.post("/menu",  async (req, res) => {
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
      `SELECT * from hpet.rhusuariomenuacessos 
      right join hpet.rhusuarios on hpet.rhusuariomenuacessos.rhusuarios_id = hpet.rhusuarios.id
      right join hpet.adsubmenu on hpet.rhusuariomenuacessos.adsubmenu_id = hpet.adsubmenu.id
      right join hpet.admenu on hpet.adsubmenu.admenu_id = hpet.admenu.id
      where hpet.rhusuarios.id=${user.id}
      order by hpet.admenu.ordem`,[user.id]
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

//Rota para gravar seção do suuario logado no sistema e retornar o usuario
router.post("/session", async (req, res) => {
  try {
    const userSession = await rhsessions.create({
      user_id: req.body.user_id,
      email: req.body.email,
      token: req.body.token
    });
    return res.send(userSession.data);
  } catch (err) {
    res.status(400).send({ error: "Houve um erro na gravação da seção do usuário !!!" });
  }
});

module.exports = router;
