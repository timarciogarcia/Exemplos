const getItensBD = () => JSON.parse(localStorage.getItem("DbProdutos")) ?? [];
const setItensBD = () => localStorage.setItem("DbProdutos", JSON.stringify(data));

data = getItensBD()
let perPage = 10
let id

let state = { 
    myAlertOk: false,
    myAlertConfirm: false,
    paginaAtual: 0,
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons: 3,
    edit: false
}

const html = {
    get(element) {
        return document.querySelector(element)
    }
}

const controls = {
    next() {
        if(state.page < state.totalPage){
            console.log("Pagina 1=> ", state.page)
            console.log("Pagina 2=> ", state.totalPage)
            state.page++
            const lasPage = state.page > state.totalPage 
            if(lasPage){
                state.page--
            }
        }
    },
    prev() {
        state.page--
        state.page < 1 ? state.page = 1 : state.page
    },
    goTo(page) {
        page < 1 ? page = 1 : +page
        state.page = page > state.totalPage ? state.totalPage : +page
    },
    createListeners() {
        html.get(".first").addEventListener('click', ()=>{
            controls.goTo(1)
            update()
        })
        html.get(".last").addEventListener('click', ()=>{
            controls.goTo(state.totalPage)
            update()
        })
        html.get(".next").addEventListener('click', ()=>{
            controls.next()
            update()
        })
        html.get(".prev").addEventListener('click', ()=>{
            controls.prev()
            update()
        })        
    },
    amountListPerPage() {
        // capturePerPage = html.get('m-perpage')
        // state.paginaAtual = 0
        // state.page = 1
        // state.perPage = capturePerPage.options[capturePerPage.selectedIndex].value
        // state.totalPage = Math.ceil(data.length / perPage)
        // state.maxVisibleButtons = 3
        // state.edit = false
        init()
    }
}

const list = {
    create(item,index) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
          <td width="3%">${item.id}</td>
          <td width="15%">${item.descricao}</td>
          <td width="15%">${item.categoria}</td>
          <td width="5%">${item.peso}</td>
          <td width="5%">${item.altura}</td>
          <td width="5%">${item.largura}</td>
          <td width="8%">${item.comprimento}</td>
          <td width="5%">${item.estoque}</td>
          <td width="10%">${item.dtcadastro}</td>
          <td width="5%" class="acao">
            <button title="Clique para alterar" onclick="dataBase.editItem(${item.id},${index})"><i class='bx bx-edit' ></i></button>
          </td>
          <td width="5%" class="acao">
            <button title="Clique para excluir" onclick="dataBase.deleteItem(${item.id},${index})"><i class='bx bx-trash'></i></button>
          </td>
        `;
        html.get('.list').appendChild(tr);      
    },    
    update() {
        html.get('.list').innerHTML = ""
        let page = state.page - 1 
        let start = page * state.perPage
        let end = start + state.perPage
        data = getItensBD()
        const paginatedItems = data.slice(start,end)
        paginatedItems.forEach((item, index, arrayData) => {list.create(item, index)})        
    }
}

const search = {
    onSearchForWord(){
      data = JSON.parse(localStorage.getItem("ArrayBackup"));
      setItensBD();
      if(document.querySelector("#m-search").value == null ||
          document.querySelector("#m-search").value == undefined ||
          document.querySelector("#m-search").value == '' ||
          document.querySelector("#m-search").value == false
          ){
            search.clearSearch() 
          }
          search.searchProduct(document.querySelector("#m-search").value);
  
      },
    searchProduct(onSearchForWord) { 
        if(onSearchForWord){
          //GUardar o array cheio
          if(!localStorage.getItem("ArrayBackup", JSON.stringify(data))){
            localStorage.setItem("ArrayBackup", JSON.stringify(data));
          }
          let novoItens = [];
          data.forEach((Elemento) => {
            if(Elemento.descricao.toUpperCase().includes(onSearchForWord.toUpperCase()))
            {
              novoItens.push(Elemento);
            }
          })
          if(!novoItens || novoItens===null || novoItens===undefined || novoItens.length == 0){
            document.querySelector("#m-search").value = ''
            document.querySelector("#m-search").placeholder=''
            data = JSON.parse(localStorage.getItem("ArrayBackup"));
            setItensBD;
            search.setupSearch()
            update()
        } else {
            data = novoItens
            setItensBD();
            search.setupSearch()
            update()
        }
        } else{
          //localStorage.removeItem("ArrayBackup");    
        }
      },
    setupSearch(){
        state.page= 1,
        state.perPage=10,
        state.totalPage= Math.ceil(data.length / perPage),
        state.maxVisibleButtons= 3
    },        
    clearSearch() {
        document.querySelector("#m-search").value = ''
        data = JSON.parse(localStorage.getItem("ArrayBackup"))
        setItensBD()
        search.setupSearch()
        update()
    },
    placeHolderClear(){
        document.querySelector("#m-search").placeholder=''
    }
}
      
const buttons = {
    element : html.get('.numbers'),
    create(number) {
        const button = document.createElement('div')
        button.innerHTML = number
        if(state.page==number){
            button.classList.add('active') // Se o botão for igual a página ele seta active para mudar a cor no css
        }
        buttons.element.appendChild(button) // Apenda o botão
        button.addEventListener('click',(event)=>{ // fica escutando o botão com o click para paginar
            const page = event.target.innerText
            controls.goTo(page) 
            update()
        })

    },
    update() {
        html.get('.numbers').innerHTML = ""
        const {maxLeft, maxRigth} = buttons.calculateMaxVisible()
        for(let page = maxLeft; page <= maxRigth; page++){
        buttons.create(page)
        }
    },
    calculateMaxVisible() {
        const {maxVisibleButtons} = state
        let maxLeft = (state.page - Math.floor(maxVisibleButtons/2))
        let maxRigth = (state.page + Math.floor(maxVisibleButtons/2))

        if(maxLeft < 1 ) {
            maxLeft = 1
            maxRigth = maxVisibleButtons
        }

        if(maxRigth > state.totalPage){
            maxLeft = state.totalPage - (maxVisibleButtons-1)
            maxRigth = state.totalPage
            if(maxLeft < 1) maxLeft = 1
        }
        if(data.length<=state.perPage){
            state.page=1
            maxLeft=1
            maxRigth=1
        }
        return {maxLeft, maxRigth}
    }
}

const dataBase = {
    dataFormatada() {
        var date = new Date(Date.now());
        return date.toLocaleDateString("pt-BR");
    },
    populated(){
        var popula = []   
        var id = 0     
        popula.push({ id: id+=1, descricao: 'Caixa Nº1 Mercado Livre', categoria: 'Papelão', peso: '150', largura: '12', altura: '10', comprimento: '20', estoque: '100', dtcadastro: dataBase.dataFormatada()});        
        popula.push({ id: id+=1, descricao: 'Caixa Nº2 Mercado Livre', categoria: 'Papelão', peso: '250', largura: '22', altura: '20', comprimento: '30', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº3 Mercado Livre', categoria: 'Papelão', peso: '350', largura: '32', altura: '30', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº4 Mercado Livre', categoria: 'Papelão', peso: '450', largura: '42', altura: '40', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº1', categoria: 'Isopor', peso: '50', largura: '15', altura: '10', comprimento: '25', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº2', categoria: 'Isopor', peso: '50', largura: '25', altura: '20', comprimento: '35', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº3', categoria: 'Isopor', peso: '50', largura: '35', altura: '30', comprimento: '45', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº1 Mercado Livre', categoria: 'Papelão', peso: '150', largura: '12', altura: '10', comprimento: '20', estoque: '100', dtcadastro: dataBase.dataFormatada()});        
        popula.push({ id: id+=1, descricao: 'Caixa Nº2 Mercado Livre', categoria: 'Papelão', peso: '250', largura: '22', altura: '20', comprimento: '30', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº3 Mercado Livre', categoria: 'Papelão', peso: '350', largura: '32', altura: '30', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº4 Mercado Livre', categoria: 'Papelão', peso: '450', largura: '42', altura: '40', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº1', categoria: 'Isopor', peso: '50', largura: '15', altura: '10', comprimento: '25', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº2', categoria: 'Isopor', peso: '50', largura: '25', altura: '20', comprimento: '35', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº3', categoria: 'Isopor', peso: '50', largura: '35', altura: '30', comprimento: '45', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº1 Mercado Livre', categoria: 'Papelão', peso: '150', largura: '12', altura: '10', comprimento: '20', estoque: '100', dtcadastro: dataBase.dataFormatada()});        
        popula.push({ id: id+=1, descricao: 'Caixa Nº2 Mercado Livre', categoria: 'Papelão', peso: '250', largura: '22', altura: '20', comprimento: '30', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº3 Mercado Livre', categoria: 'Papelão', peso: '350', largura: '32', altura: '30', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº4 Mercado Livre', categoria: 'Papelão', peso: '450', largura: '42', altura: '40', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº1', categoria: 'Isopor', peso: '50', largura: '15', altura: '10', comprimento: '25', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº2', categoria: 'Isopor', peso: '50', largura: '25', altura: '20', comprimento: '35', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº3', categoria: 'Isopor', peso: '50', largura: '35', altura: '30', comprimento: '45', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº1 Mercado Livre', categoria: 'Papelão', peso: '150', largura: '12', altura: '10', comprimento: '20', estoque: '100', dtcadastro: dataBase.dataFormatada()});        
        popula.push({ id: id+=1, descricao: 'Caixa Nº2 Mercado Livre', categoria: 'Papelão', peso: '250', largura: '22', altura: '20', comprimento: '30', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº3 Mercado Livre', categoria: 'Papelão', peso: '350', largura: '32', altura: '30', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº4 Mercado Livre', categoria: 'Papelão', peso: '450', largura: '42', altura: '40', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº1', categoria: 'Isopor', peso: '50', largura: '15', altura: '10', comprimento: '25', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº2', categoria: 'Isopor', peso: '50', largura: '25', altura: '20', comprimento: '35', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº3', categoria: 'Isopor', peso: '50', largura: '35', altura: '30', comprimento: '45', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº1 Mercado Livre', categoria: 'Papelão', peso: '150', largura: '12', altura: '10', comprimento: '20', estoque: '100', dtcadastro: dataBase.dataFormatada()});        
        popula.push({ id: id+=1, descricao: 'Caixa Nº2 Mercado Livre', categoria: 'Papelão', peso: '250', largura: '22', altura: '20', comprimento: '30', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº3 Mercado Livre', categoria: 'Papelão', peso: '350', largura: '32', altura: '30', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº4 Mercado Livre', categoria: 'Papelão', peso: '450', largura: '42', altura: '40', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº1', categoria: 'Isopor', peso: '50', largura: '15', altura: '10', comprimento: '25', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº2', categoria: 'Isopor', peso: '50', largura: '25', altura: '20', comprimento: '35', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº3', categoria: 'Isopor', peso: '50', largura: '35', altura: '30', comprimento: '45', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº1 Mercado Livre', categoria: 'Papelão', peso: '150', largura: '12', altura: '10', comprimento: '20', estoque: '100', dtcadastro: dataBase.dataFormatada()});        
        popula.push({ id: id+=1, descricao: 'Caixa Nº2 Mercado Livre', categoria: 'Papelão', peso: '250', largura: '22', altura: '20', comprimento: '30', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº3 Mercado Livre', categoria: 'Papelão', peso: '350', largura: '32', altura: '30', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Caixa Nº4 Mercado Livre', categoria: 'Papelão', peso: '450', largura: '42', altura: '40', comprimento: '40', estoque: '100', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº1', categoria: 'Isopor', peso: '50', largura: '15', altura: '10', comprimento: '25', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº2', categoria: 'Isopor', peso: '50', largura: '25', altura: '20', comprimento: '35', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        popula.push({ id: id+=1, descricao: 'Marmitex Nº3', categoria: 'Isopor', peso: '50', largura: '35', altura: '30', comprimento: '45', estoque: '1000', dtcadastro: dataBase.dataFormatada()});
        data = popula
        setItensBD()
        localStorage.setItem("ArrayBackup", JSON.stringify(data));
        window.location.reload()
    },
    erase(){
        data = []      
        localStorage.setItem("ArrayBackup", JSON.stringify(data));          
        setItensBD()
        init()
    },
    editItem(outId,index){
        console.log(outId, index)
        if(outId > 0){
            inventory = getItensBD()
            result = inventory.find( ({ id }) => id === outId )

            html.get("#m-titulo").textContent = "Edição de Produto";
            const modal = html.get(".modal-container");
            modal.classList.add("active");

            html.get("#m-index").value = index
            console.log("Index ",html.get("#m-index").value)
            html.get("#m-id").value = result.id
            console.log("ID ",html.get("#m-id").value)
            html.get("#m-descricao").value = result.descricao
            html.get("#m-categoria").value = result.categoria
            html.get("#m-peso").value = result.peso
            html.get("#m-altura").value = result.altura
            html.get("#m-largura").value = result.largura
            html.get("#m-comprimento").value = result.comprimento
            html.get("#m-estoque").value = result.estoque
            state.edit = true
        }
    },
    insertItem(){
        const modal = html.get(".modal-container");
        modal.classList.add("active");
        html.get("#m-titulo").textContent = "Inclusão de Produto";
        html.get("#m-descricao").value = ''
        html.get("#m-categoria").value = ''
        html.get("#m-peso").value = ''
        html.get("#m-altura").value = ''
        html.get("#m-largura").value = ''
        html.get("#m-comprimento").value = ''
        html.get("#m-estoque").value = '' 
        state.edit = false
    },
    saveItem(){
        // Se for vazio volta
        //state.paginaAtual = state.page
        if( 
            html.get("#m-descricao").value == '' ||
            html.get("#m-categoria").value == '' ||
            html.get("#m-peso").value == '' ||
            html.get("#m-altura").value == '' ||
            html.get("#m-largura").value == '' ||
            html.get("#m-comprimento").value == '' ||
            html.get("#m-estoque").value == '' 
        )
        { 
            return
        }

        const varIndex = html.get("#m-index").value //Ponteiro do Array da Tela
        const varId    = html.get("#m-id").value // Id do Array da Tela e do LocalStore

        // 1ª PARTE, EDIÇÃO DO PRODUTO    

        if ( state.edit ){ 
            console.log("UPDATE")
            console.log("PARTE DOS PRODUTOS")
            // Iniciando Update do Array da localStorage Produtos
            DB = getItensBD() // Busca Banco de Dados de Produtos na Memoria    
            // Busca e Atualiza pelo Id
            for(var I=0; I<DB.length; I++){
                console.log("VASCULHANDO O ID " + DB[I].id)    
                console.log("COMPARANDO COM O ID " + varId)
                if( DB[I].id == varId){
                console.log("ENCONTROU O PRODUTO COM O ID ==> " + DB[I].id)
                DB[I].descricao = html.get("#m-descricao").value
                DB[I].categoria = html.get("#m-categoria").value
                DB[I].peso = html.get("#m-peso").value
                DB[I].altura = html.get("#m-altura").value
                DB[I].largura = html.get("#m-largura").value
                DB[I].comprimento = html.get("#m-comprimento").value
                DB[I].estoque = html.get("#m-estoque").value    
               }
            }
            // Grava NOvamente o DB
            data = DB
            setItensBD()
            console.log("GRAVOU PRIMEIRO UPDATE")
            // Finalizado Update do Array Local da localStorage Produtos
            // -------------------------------------------------------
            // Update do Array Backup de Estiver ativo no localStorage
            console.log("UPDATE")
            console.log("PARTE BACKUP DOS PRODUTOS")
            DB = JSON.parse(localStorage.getItem("ArrayBackup")) 
            // Busca e Atualiza pelo Id
            for(var I=0; I<DB.length; I++){
                console.log("VASCULHANDO O ID " + DB[I].id)    
                console.log("COMPARANDO COM O ID " + varId)
                if( DB[I].id == varId){
                    console.log("ENCONTROU O PRODUTO COM O ID ==> " + DB[I].id)
                    DB[I].descricao = html.get("#m-descricao").value
                    DB[I].categoria = html.get("#m-categoria").value
                    DB[I].peso = html.get("#m-peso").value
                    DB[I].altura = html.get("#m-altura").value
                    DB[I].largura = html.get("#m-largura").value
                    DB[I].comprimento = html.get("#m-comprimento").value
                    DB[I].estoque = html.get("#m-estoque").value    
                }
            }
            // Grava NOvamente o DB
            localStorage.setItem("ArrayBackup", JSON.stringify(DB));
            console.log("GRAVOU SEGUNDO UPDATE")
            alert("Produto atualizado com sucesso !");
            // Finalizado Update do ArrayBackup da localStorage
            // -------------------------------------------------------
            // Update do Array da Tela
            // Update ja realizado no procedimento acima quando se iguala data ao DB
            // -------------------------------------------------------
        }else{ // INCLUSÔES
            // Insert do Novo Produto no Array de Produtos na localstorage
            // Iniciando Insert do Array Backup            
            DB = JSON.parse(localStorage.getItem("ArrayBackup")) 
            let controle = !DB.length || DB.length === 0 ? 1 : DB[DB.length-1].id + 1            
            let agora = new Date().toLocaleString();
            let Inclusao = {
                id: controle,
                descricao: html.get("#m-descricao").value,
                categoria: html.get("#m-categoria").value,
                peso: html.get("#m-peso").value,
                altura: html.get("#m-altura").value,
                largura: html.get("#m-largura").value,
                comprimento: html.get("#m-comprimento").value,
                estoque: html.get("#m-estoque").value,
                dtcadastro: dataBase.dataFormatada()
            }
            DB.push( Inclusao )
            localStorage.setItem("ArrayBackup", JSON.stringify(DB))
            //-----------------------------------------------------
            data = DB
            setItensBD()
            alert("Produto cadastrado com sucesso !");
            // Finalizado Insert do Array Local da localStorage Produtos
            // -------------------------------------------------------
        }        
    },
    deleteItem(outId, index){
        var resultado = confirm(
            "Deseja excluir o item de ID: " + outId + " ?"
        );
        if (resultado == true) {
            
            DB = JSON.parse(localStorage.getItem("ArrayBackup")) 
            data = DB
            let index = DB.findIndex(i => i.id == outId);
            DB.splice(index, 1);
            data = DB
            localStorage.setItem("ArrayBackup", JSON.stringify(DB));
            setItensBD();
            window.location.reload()
            alert("Produto excluido com sucesso !");
        }
    },
    voltar() {
        const modal = html.get(".modal-container");
        modal.classList.remove("active");
    }    
}

const utils = {
    sizeScreen() {
        var vWidth = document.documentElement.clientWidth
        var hHeigth = document.documentElement.clientHeight
        alert( "Width: " + vWidth + " Heigth: " + hHeigth)
    }
}

function update(){
    list.update()
    buttons.update()
}

function init(){
    //console.log(data)
    update()
    controls.createListeners()
}

init()
