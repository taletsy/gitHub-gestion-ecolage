import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrl: './reglement.component.scss',
})
export class ReglementComponent {
  tableauEleve: any[] = [];
  tableauLibelle: any[] = [];
  tableauVerifier: any[] = [];
  tableauPaiement: any[] = [];
  tableauListePaiement: any[] = [];
  tableClasse: any[] = [];
  searchText: string = '';
  libelle: string = 'DROIT';
  tarif: number = 0;
  idCurrent: string = '';
  sommeRecue: number = 0;
  sommeRestante: number = 0;
  sommeVerser: number = 0;
  matriculeVerifier: string = '';
  reponseMatricule: any[] = [];
  nbre: number = 0;
  isInscrit = false;
  isCorrect = true;
  classe: string = '';

  sm_recue: number = 0;
  sm_rest: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllStudent();
    this.listePaiement();
    this.getClasse();
  }

  rechercher() {
    var input = document.getElementById('search') as HTMLInputElement;
    var table = document.getElementById('listePaiement');

    if (table && input) {
      if (input && table) {
        var value = input.value.toLowerCase();
        var rows = table.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
          if (rows) {
            var row = rows[i];
            if (row.textContent) {
              var text = row.textContent.toLowerCase();
              row.style.display =
                text.indexOf(value) > -1 ? 'table-row' : 'none';
            }
          }
        }
      }
    }
  }

  getClasse() {
    this.http
      .get('http://localhost:8085/api/student/classe/')
      .subscribe((resultData: any) => {
        this.tableClasse = resultData.data;
      });
    const myInputSelect = document.getElementById('classe');
  }

  showPaiement(data: any) {
    this.libelle = data.libelle;
    this.getTarif();
    this.verifierSomme();
    this.idCurrent = data.matricule;
    this.sommeRecue = data.sommeRecue;
    //PREMIERE FOIS
    if (this.sommeRecue === 0) {
      this.sommeRestante = this.tarif;
      //DEUXIEME ET PLUS
    } else {
      this.sommeRestante = data.sommeRestante;
    }
  }

  verifierSomme() {
    if (this.sommeVerser > 0 && this.sommeVerser.toString() !== '') {
      // POUR LA PREMIERE FOIS
      if (this.sommeRecue === 0) {
        if (this.sommeVerser <= this.tarif) {
          this.isCorrect = true;
          this.sm_recue = this.sommeRecue * 1 + this.sommeVerser * 1;
          this.sm_rest = this.tarif * 1 - this.sm_recue * 1;
        } else if (this.sommeVerser > this.tarif) {
          this.isCorrect = false;
        } else {
          this.isCorrect = false;
        }
      } else {
        //POUR LA DEXIEUME FOIS ET PLUS
        if (this.sommeVerser <= this.sommeRestante) {
          this.isCorrect = true;
          let recue = this.sommeRecue * 1 + this.sommeVerser * 1;
          let restante = this.tarif * 1 - recue * 1;
          this.sm_recue = recue;
          this.sm_rest = restante;
        } else {
          this.isCorrect = false;
        }
      }
    } else {
      this.isCorrect = false;
    }
  }

  getTarif() {
    if (this.libelle === 'DROIT') {
      this.tarif = 20000;
    } else if (this.libelle === 'Frais G + SPORT') {
      this.tarif = 26000;
    } else if (this.libelle === 'VRM') {
      this.tarif = 10000;
    } else if (this.libelle === 'DIDEC') {
      this.tarif = 2000;
    } else if (this.libelle === 'ASSURANCE') {
      this.tarif = 2000;
    } else {
      let classeEleve = this.tableauVerifier[0].nomClasse;
      if (classeEleve === 'TS' || classeEleve === 'TL') {
        this.tarif = 24000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '1èreU') {
        this.tarif = 23000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '2nde') {
        this.tarif = 22000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '3èmeA' || classeEleve === '3èmeB') {
        this.tarif = 21000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '4ème') {
        this.tarif = 20000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '5èmeA' || classeEleve === '5èmeB') {
        this.tarif = 20000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '6ème') {
        this.tarif = 20000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '7ème') {
        this.tarif = 19000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '8ème') {
        this.tarif = 18000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === '9ème') {
        this.tarif = 17000;
        console.log('verser : ' + this.tarif);
      } else if (classeEleve === 'JE') {
        this.tarif = 26000;
      }
    }
  }

  valider() {
    let bodyData = {
      id: this.idCurrent,
      libelle: this.libelle,
      sm_recue: this.sm_recue,
      sm_restante: this.sm_rest,
    };

    this.http
      .put('http://localhost:8085/api/student/reglerPaiement', bodyData)
      .subscribe((resultData: any) => {
        this.clearChamps();
        this.listePaiement();
      });
  }

  getLibelle() {
    this.http
      .get('http://localhost:8085/api/student/libelle/')
      .subscribe((resultData: any) => {
        this.tableauLibelle = resultData.data;
      });
  }

  getAllStudent() {
    this.http
      .get('http://localhost:8085/api/student/')
      .subscribe((resultData: any) => {
        this.tableauEleve = resultData.data;
      });
  }

  getMatricule() {
    if (this.matriculeVerifier !== '') {
      this.http
        .get(
          'http://localhost:8085/api/student/verification' +
            '/' +
            this.matriculeVerifier
        )
        .subscribe((resultData: any) => {
          if (resultData.data) {
            this.nbre = parseInt(resultData.data[0].nb);

            if (this.nbre === 1) {
              this.isInscrit = true;
              this.getInfo();
              this.carteEcolage();
            } else if (this.nbre === 0) {
              this.tableauVerifier = [];
              this.tableauPaiement = [];
              this.isInscrit = false;
            }
          }
        });
    } else {
      this.nbre = 0;
      this.tableauVerifier = [];
      this.tableauPaiement = [];
      this.isInscrit = false;
    }
  }

  getInfo() {
    this.http
      .get(
        'http://localhost:8085/api/student/information' +
          '/' +
          this.matriculeVerifier
      )
      .subscribe((resultData: any) => {
        this.tableauVerifier = resultData.data;
      });
  }

  carteEcolage() {
    this.http
      .get(
        'http://localhost:8085/api/student/carteEcolage' +
          '/' +
          this.matriculeVerifier
      )
      .subscribe((resultData: any) => {
        this.tableauPaiement = resultData.data;
      });
  }

  listePaiement() {
    this.http
      .get('http://localhost:8085/api/student/listePaiement')
      .subscribe((resultData: any) => {
        this.tableauListePaiement = resultData.data;
      });
  }

  clearChamps() {
    this.sommeRecue = 0;
    this.sommeRestante = 0;
    this.sommeVerser = 0;
    this.carteEcolage();
  }

  onClose() {
    this.clearChamps();
  }
}
