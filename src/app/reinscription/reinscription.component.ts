import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reinscription',
  templateUrl: './reinscription.component.html',
  styleUrl: './reinscription.component.scss',
})
export class ReinscriptionComponent {
  tableauEleve: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  isCompleted = false;
  searchText: string = '';
  buttonInscription: any = '';
  tableClasse: any[] = [];
  tableLastID: any[] = [];
  tableGroupe: any[] = [];
  infoLastID: any[] = [];
  tableAnneeScolaire: any[] = [];

  nom: string = '';
  prenoms: string = '';
  sexe: string = 'Masculin';
  classe: string = 'TS';
  groupe: string = 'ELEVE';
  anneeScolaire: string = '2023-2024';
  currentStudentID = '';
  lastID: string = '';
  buttonDisplay: any;

  constructor(private http: HttpClient) {
    this.getAllStudent();
  }

  ngOnInit(): void {
    const el = document.getElementById('navInscription');
    if (el) {
      this.buttonDisplay = el.style.display;
    }
  }

  // RECUPERER CLASSES, GROUPES, ANNESCOLAIRE DEPUIS LA BASE DO DONNEE
  getClasse() {
    this.http
      .get('http://localhost:8085/api/student/classe/')
      .subscribe((resultData: any) => {
        this.tableClasse = resultData.data;
      });
    const myInputSelect = document.getElementById('classe');
  }

  getGroupe() {
    this.http
      .get('http://localhost:8085/api/student/groupe/')
      .subscribe((resultData: any) => {
        this.tableGroupe = resultData.data;
        /*const myInputSelect = document.getElementById('groupe');
        if (myInputSelect) {
          for (let i = 0; i < this.tableGroupe.length; i++) {
            let option = document.createElement('option');
            const tabGroupe = this.tableGroupe[i].nomGroupe;
            option.text = tabGroupe;
            option.value = tabGroupe;
            myInputSelect.appendChild(option);
          }
        }*/
      });
  }

  getAnnee() {
    this.http
      .get('http://localhost:8085/api/student/annee/')
      .subscribe((resultData: any) => {
        this.tableAnneeScolaire = resultData.data;
      });
  }

  // CRUDS METHODS

  getAllStudent() {
    this.http
      .get('http://localhost:8085/api/student/')
      .subscribe((resultData: any) => {
        if (resultData) {
          this.tableauEleve = resultData.data;
          this.nombreEtudiant();
        }
      });
  }

  getLastId() {
    this.http
      .get('http://localhost:8085/api/student/lastId/')
      .subscribe((resultData: any) => {
        if (resultData) {
          this.lastID = resultData.data[0].matricule;
          console.log(this.lastID);
        }
        this.getInfo();
      });
  }

  getInfo() {
    this.http
      .get('http://localhost:8085/api/student/information' + '/' + this.lastID)
      .subscribe((resultData: any) => {
        this.infoLastID = resultData.data;
      });
  }

  register() {
    let bodyData = {
      nom: this.nom,
      prenoms: this.prenoms,
      sexe: this.sexe,
      nomClasse: this.classe,
      nomGroupe: this.groupe,
      anneeScolaire: this.anneeScolaire,
    };

    this.http
      .post('http://localhost:8085/api/student/add', bodyData)
      .subscribe((resultData: any) => {
        this.getAllStudent();
      });
  }

  save() {
    if (this.currentStudentID == '') {
      this.register();
      this.alertSuccess();
      this.clearChamps();
      this.getLastId();
      this.onCloseModel();
      this.isCompleted = false;
    } else {
      this.UpdateRecords();
      this.reinitialiserPaiement();
      this.onCloseModel();
      this.alertInfo();
    }
  }

  reinitialiserPaiement() {
    this.http
      .delete(
        'http://localhost:8085/api/reinitialiserPaieReinscription' +
          '/' +
          this.currentStudentID
      )
      .subscribe((resultData: any) => {});
  }

  setUpdate(data: any) {
    this.onAddStudent();
    this.nom = data.nom;
    this.prenoms = data.prenoms;
    this.sexe = data.sexe;
    this.classe = data.nomClasse;
    this.groupe = data.nomGroupe;
    this.currentStudentID = data.matricule;
    this.isCompleted = true;
  }

  UpdateRecords() {
    let bodyData = {
      nom: this.nom,
      prenoms: this.prenoms,
      sexe: this.sexe,
      classe: this.classe,
      groupe: this.groupe,
    };

    this.http
      .put(
        'http://localhost:8085/api/student/update' +
          '/' +
          this.currentStudentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        this.getAllStudent();
      });
  }

  prepareDelete(id: string) {
    const notNull = document.getElementById('modalDeleteConfirmation');
    if (notNull != null) {
      notNull.style.display = 'block';
      this.currentStudentID = id;
    }
  }

  setDelete(id: string) {
    this.http
      .delete('http://localhost:8085/api/student/delete' + '/' + id)
      .subscribe((resultData: any) => {
        this.alertError();
        this.closeDeleteModal();
        this.getAllStudent();
        this.http
          .delete('http://localhost:8085/api/student/deletePaiement' + '/' + id)
          .subscribe((resultData: any) => {});
      });
  }

  // BUUTONS EVENTS

  onCloseModel() {
    const notNull = document.getElementById('studentModel');
    if (notNull != null) {
      notNull.style.display = 'none';
    }
  }

  closeDeleteModal() {
    const notNull = document.getElementById('modalDeleteConfirmation');
    if (notNull != null) {
      notNull.style.display = 'none';
    }
  }

  onAddStudent() {
    const notNull = document.getElementById('studentModel');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.clearChamps();
    this.getClasse();
    this.getGroupe();
    this.getAnnee();
    this.isCompleted = false;
  }

  // CONTROLLERS

  clearChamps() {
    this.nom = '';
    this.prenoms = '';
    this.currentStudentID = '';
  }

  onTyping() {
    // this.classe !== "" && this.groupe !== "" && this.anneeScolaire !== ""
    if (this.nom !== '' && this.prenoms !== '' && this.sexe !== '') {
      this.isCompleted = true;
    } else {
      this.isCompleted = false;
    }
  }

  onTypingName(mot: string) {
    if ('' + parseInt(mot) !== 'NaN') {
      this.nom = ' ';
    }
  }

  onTypingFirstName(mot: string) {
    if ('' + parseInt(mot) !== 'NaN') {
      this.prenoms = ' ';
    }
  }

  // ALERT

  alertSuccess() {
    const toast = document.getElementById('toast-success');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    }
  }

  alertInfo() {
    const toast = document.getElementById('toast-info');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    }
  }

  alertError() {
    const toast = document.getElementById('toast-danger');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    }
  }

  // STATISTIC

  eds() {
    const groupe = this.tableauEleve.map((eleve) => {
      return eleve.nomGroupe;
    });

    const eds = groupe.filter((p) => {
      return p === 'EDS(Enfant de soleil)';
    });

    const nombreeds = eds.length;

    const paragrph = document.getElementById('eds');
    if (paragrph) {
      paragrph.innerHTML = ' ' + nombreeds;
    }
  }

  fdp() {
    const groupe = this.tableauEleve.map((eleve) => {
      return eleve.nomGroupe;
    });

    const fdp = groupe.filter((p) => {
      return p === 'FDP(Fils de personnel)';
    });

    const nombrefdp = fdp.length;

    const p = document.getElementById('fdp');
    if (p) {
      p.innerHTML = ' ' + nombrefdp;
    }
  }

  eleve() {
    const groupe = this.tableauEleve.map((eleve) => {
      return eleve.nomGroupe;
    });

    const eleve = groupe.filter((p) => {
      return p === 'ELEVE';
    });

    const nombreeleve = eleve.length;

    const p = document.getElementById('eleve');
    if (p) {
      p.innerHTML = ' ' + nombreeleve;
    }
  }

  nombreEtudiant() {
    const p = document.getElementById('nombreTotal');
    if (p) {
      p.innerHTML = ' ' + this.tableauEleve.length;
    }
    this.eds();
    this.fdp();
    this.eleve();
  }
}
