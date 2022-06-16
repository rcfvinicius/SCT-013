const load = document.querySelector('#load');
/* checkbox selecionar-tudo */
document.querySelector('#selecionar-tudo').addEventListener('click', () => {
    if(document.querySelector('#selecionar-tudo').checked){
        document.querySelectorAll('#parte-superior select')[0].style = 'opacity:0.5;';
        document.querySelectorAll('#parte-superior select')[1].style = 'opacity:0.5;';
    }else{
        document.querySelectorAll('#parte-superior select')[0].style = 'opacity:1';
        document.querySelectorAll('#parte-superior select')[1].style = 'opacity:1';
    }
})


/* menu lateral */
const abrirAreaLateral = (a, abrir) =>{
    const areaLateral = document.querySelector('#area-lateral')

    if(areaLateral.offsetWidth < 300 || abrir){
        areaLateral.style = 'width:400px;';
        document.querySelector('#abrir-fechar-button').innerHTML = '<';
        document.querySelector('#pelicula').style = 'display:block;';
    }else{
        areaLateral.style = 'width:0px;';
        document.querySelector('#abrir-fechar-button').innerHTML = '>';
        document.querySelector('#pelicula').style = 'display:none;';
    }

}
document.querySelector('#abrir-fechar-button').addEventListener('click', abrirAreaLateral)

/* options */
const options = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
}

let requisicoes = [];

function showResults(todasreqs){       
    //todasreqs[0][linha][elemento da linha(4)]
     document.querySelector('#conteudo').innerHTML = ''
     for(i=0;i<todasreqs[0].length;i++){
        document.querySelector('#conteudo').innerHTML = `
        <p>Tempo parado: ${todasreqs[0][i][0]}, 
        Parada: ${todasreqs[0][i][1]}, 
        Data: ${todasreqs[0][i][2].replace('_',' ').replace('-','/').replace('-','/')},
        Máquina: ${todasreqs[0][i][3][7]}
        </p>`
        + document.querySelector('#conteudo').innerHTML;
     } 
}
/* limpar filtros */
document.querySelector('#limpar-btn').addEventListener('click', () => {
    document.querySelector('#botoes-de-filtro [name="maquina"]').value='all';
    document.querySelector('#botoes-de-filtro [name="ano"]').value='all';
    document.querySelector('#botoes-de-filtro [name="mes"]').value='all';
    document.querySelector('#botoes-de-filtro [name="dia"]').value='all';

    showResults(requisicoes);
})
/* filtrar */
document.querySelector('#filtrar-btn').addEventListener('click',() => {
    let maquina = document.querySelector('#botoes-de-filtro [name="maquina"]').value;
    let parada = document.querySelector('#botoes-de-filtro [name="parada"]').value;
    let ano = document.querySelector('#botoes-de-filtro [name="ano"]').value;
    let mes = document.querySelector('#botoes-de-filtro [name="mes"]').value;
    let dia = document.querySelector('#botoes-de-filtro [name="dia"]').value;

    if(maquina == 'all'){maquina = '';}
    if(parada == 'all'){parada = '';}
    if(ano == 'all'){ano = '';}
    if(mes == 'all'){mes = '';}
    if(dia == 'all'){dia = '';}

     //requisicoes[0][linha]
    let filtrado = [[]]
    for(let linha=0;linha<requisicoes[0].length;linha++){
        if(requisicoes[0][linha][3].includes(maquina) && requisicoes[0][linha][1].includes(parada) && requisicoes[0][linha][2].slice(15,17).includes(ano) && requisicoes[0][linha][2].slice(12,14).includes(mes) && requisicoes[0][linha][2].slice(9,11).includes(dia)){
            filtrado[0].push(requisicoes[0][linha]);
        }
    }
    showResults(filtrado);
})

/* botao superior fetch */
document.querySelector('#botao-superior').addEventListener('click', () =>{
    const mes = document.querySelectorAll('#parte-superior select')[0].value;
    const ano = document.querySelectorAll('#parte-superior select')[1].value;
    const selectAll = document.querySelector('#selecionar-tudo').checked;
    
    if(selectAll){
        load.style = 'display:flex;';
        fetch('http://rcfvinicius.pythonanywhere.com/select-all?ano=all&mes=all', options)
        .then((res) => res.json())
        .then(res => {
            requisicoes = [];
            requisicoes.push(res.lista);
            showResults(requisicoes);
            load.style = 'display:none;';
        })
        .catch((erro) => {
            alert(erro);
            load.style = 'display:none;';
        })
    }
    else{
        load.style = 'display:flex;';
        fetch(`http://rcfvinicius.pythonanywhere.com/select-all?ano=${ano}&mes=${mes}`, options)
        .then((res) => res.json())
        .then(res => {
            requisicoes = [];
            requisicoes.push(res.lista);
            showResults(requisicoes);
            load.style = 'display:none;';
        })
        .catch((erro) => {
            alert(erro);
            load.style = 'display:none;';
        })
    }
   

})


    /* botao inferior fetch */
document.querySelector('#botao-inferior').addEventListener('click', () =>{
    abrirAreaLateral(undefined,true);

    const dia = document.querySelectorAll('#parte-inferior select')[0].value;
    const mes = document.querySelectorAll('#parte-inferior select')[1].value;
    const ano = document.querySelectorAll('#parte-inferior select')[2].value;
    const maquina = document.querySelector('#select-maquina').value;

    let periodo;
    if(document.querySelector('#a').checked){periodo = 'a'}
    else if(document.querySelector('#b').checked){periodo = 'b'}
    else if(document.querySelector('#c').checked){periodo = 'c'}

    load.style = 'display:flex;';
    fetch(`http://rcfvinicius.pythonanywhere.com/select?periodo=${periodo}&data=${dia}-${mes}-${ano}&maquina=${maquina}`, options)
    .then((res) => res.json())
    .then(res => {  
        document.querySelector('#info-grafico').innerHTML = `
        <h2>Máquina: ${res.maquina.slice(7,8)} - Periodo ${periodo.toUpperCase()}</h2>
        <h3>Emergência: ${res.Emergencia} - ${res.pEmergencia} parada(s)</h3>
        <h3>Corte: ${res.Corte} - ${res.pCorte} parada(s)</h3>
        <h3>Quebra: ${res.Quebra} - ${res.pQuebra} parada(s)</h3>
        <h3>TOTAL: ${res.TOTAL}</h3>
        <h3>Eficiência: ${res.Eficiencia}%</h3>
        `;

        const emergencia = (parseInt(res.Emergencia.slice(0,2))*60*60) + 
        (parseInt(res.Emergencia.slice(3,5))*60) +
        parseInt(res.Emergencia.slice(6,8));

        const corte = (parseInt(res.Corte.slice(0,2))*60*60) + 
        (parseInt(res.Corte.slice(3,5))*60) +
        parseInt(res.Corte.slice(6,8));

        const quebra = (parseInt(res.Quebra.slice(0,2))*60*60) + 
        (parseInt(res.Quebra.slice(3,5))*60) +
        parseInt(res.Quebra.slice(6,8));


        const svg = document.querySelector('#area-lateral svg');

        let corE = 'rgb(214, 10, 10)';
        let corC = 'rgb(14, 184, 226)';
        let corQ = 'rgb(81, 6, 221)';

        let vEmergencia;
        let vCorte;
        let vQuebra;
        /* converter pra o valor final */
        for(let i=1;i<=3;i++){
        if(i==1){
            vEmergencia = 440*(100*emergencia/(emergencia + corte + quebra))/100
        }else if(i==2){
            vCorte = 440*(100*corte/(emergencia + corte + quebra))/100
        }else{
            vQuebra = 440*(100*quebra/(emergencia + corte + quebra))/100
        }
        }
        /* verificar qual é o maior */
        if(emergencia >= corte && emergencia >= quebra){
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vEmergencia+vCorte+vQuebra});
            stroke: ${corE};">
            </circle>`

        if(corte >= quebra){
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vCorte+vQuebra});
            stroke: ${corC};">
            </circle>`

            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vQuebra});
            stroke: ${corQ};">
            </circle>`
        }else{
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vCorte+vQuebra});
            stroke: ${corQ};">
            </circle>`
            
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vCorte});
            stroke: ${corC};">
            </circle>`
        }
        }else if(corte >= quebra){
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vEmergencia+vCorte+vQuebra});
            stroke: ${corC};">
            </circle>`
        if(quebra >= emergencia){
            svg.innerHTML+=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vQuebra+vEmergencia});
            stroke: ${corQ};">
            </circle>`

            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vEmergencia});
            stroke: ${corE};">
            </circle>`
        }else{
            svg.innerHTML+=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vQuebra+vEmergencia});
            stroke: ${corE};">
            </circle>`

            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vQuebra});
            stroke: ${corQ};">
            </circle>`
        }
        }else if(quebra >= corte){
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vEmergencia+vCorte+vQuebra});
            stroke: ${corQ};">
            </circle>`
            if(corte >=emergencia){
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vCorte+vEmergencia});
            stroke: ${corC};">
            </circle>`
            
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vEmergencia});
            stroke: ${corE};">
            </circle>`
            }else{
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vCorte+vEmergencia});
            stroke: ${corE};">
            </circle>`
            
            svg.innerHTML +=
            `<circle cx="99" cy="99" r="70" 
            style="stroke-dashoffset: calc(440 - ${vCorte});
            stroke: ${corC};">
            </circle>`
            }
        }
    if(res.Eficiencia == '100'){
        svg.innerHTML = '<circle cx="99" cy="99" r="70"></circle>';
    }
    load.style = 'display:none;';
    }).catch((erro) => {
        alert(erro);
        load.style = 'display:none;';
    })

    //http://rcfvinicius.pythonanywhere.com/select?periodo=c&data=19-02-22&maquina=maquina2    
    //console.log(`http://rcfvinicius.pythonanywhere.com/select?periodo=${periodo}&data=${dia}-${mes}-${ano}&maquina=${maquina}`);
})

