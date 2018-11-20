import api from './api';

class App {
    constructor(){
        //guardar os repositories
        //this.repositories = [];
        this.repositories = JSON.parse(localStorage.getItem('listRepositories'))||[];
        //referenciando os elementos da dom
        this.formElement = document.getElementById('repo-form');
        this.inputElement = document.querySelector('input[name=repository]')
        this.listElement = document.getElementById('repo-list');
       
        this.registerEvents();
        this.render();

    }

    registerEvents(){
        //Quais são os eventos 
        /* this.formElement.onsubmit = function(event){
            addRepository(event);
        }*/
        this.formElement.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading= true){

        if(loading===true){
            let loadingElement = document.createElement('span');
            loadingElement.appendChild(document.createTextNode('Loading'));
            loadingElement.setAttribute('id','loading');
            this.formElement.appendChild(loadingElement);
        }else{
            document.getElementById('loading').remove();
        }

    }
    async addRepository(){
        //evitar envio get e set da pagina html
        event.preventDefault();

        const repoInput = this.inputElement.value;

        if(repoInput.length === 0)
            return;
        
        this.setLoading();

        try{
        const response = await api.get(`/repos/${repoInput}`);
        const { name, description, html_url, owner: { avatar_url}} = response.data;


        this.repositories.push({
            name,
            description,
            avatar_url,
            html_url,
        });

        this.inputElement.value = '';

        this.setLoading(false);
        this.saveToStorage();
        this.render();

        }catch(err){
            this.setLoading(false);
            alert('Repository does not exist');
            
        }

        
    }
    render(){
        //apagando elementos
        this.listElement.innerHTML = '';
        //percorrendo repositorios
        this.repositories.forEach(repo =>{

            var pos = this.repositories.indexOf(repo);

            //criando o elemento imagme
            let imgElement = document.createElement('img');
            imgElement.setAttribute('src',repo.avatar_url);

            let titleElement = document.createElement('strong');
            titleElement.appendChild(document.createTextNode(repo.name));

            let descriptionElement = document.createElement('p');
            descriptionElement.appendChild(document.createTextNode(repo.description));

            let linkElement = document.createElement('a');
            linkElement.setAttribute('target','_blank');
            linkElement.setAttribute('href',repo.html_url);
            linkElement.appendChild(document.createTextNode('Access '));
            
            let linkDeleteElement = document.createElement('button');
            linkDeleteElement.setAttribute('target','_blank');
            linkDeleteElement.appendChild(document.createTextNode('Delete'));
            linkDeleteElement.onclick = pos => this.deleteRepository(pos);

            let listItemElement = document.createElement('li');
            listItemElement.appendChild(imgElement);
            listItemElement.appendChild(titleElement);
            listItemElement.appendChild(descriptionElement);
            listItemElement.appendChild(linkElement);
            listItemElement.appendChild(linkDeleteElement);
            
            
            this.listElement.appendChild(listItemElement);

             
        });
    }
    saveToStorage(){
        localStorage.setItem('listRepositories',JSON.stringify(this.repositories));
        //console.log(this.repositories);
    }

    deleteRepository(pos){
        this.repositories.splice(pos,1);
        this.saveToStorage();
        this.render();
    }
    
}

//instaciando a classe
//const MyApp = new App();
// mas como nao precisa reutilizar a classe podemos fazer assim
new App