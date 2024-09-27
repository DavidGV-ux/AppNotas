import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Materia, Nota } from '../../models/models';
import { MateriasService } from '../../services/materias.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-materia',
  templateUrl: './crear-materia.page.html',
  styleUrls: ['./crear-materia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CrearMateriaPage implements OnInit {
  materia: Materia = {
    id: '',
    nombre: '',
    semestre: 0,
    codigo: '',
    horario: '',
    observaciones: '',
    notas: []
  };

  nuevaNota: Nota = {
    fechaEntrega: new Date(),
    descripcion: '',
    nota: 0,
    corte: 1
  };

  constructor(private materiasService: MateriasService, private router: Router) {}

  ngOnInit() {}

  generateId() {
    return Math.random().toString(36).substring(2);
  }

  agregarNota() {
    this.materia.notas.push({ ...this.nuevaNota });
    this.nuevaNota = { fechaEntrega: new Date(), descripcion: '', nota: 0, corte: 1 }; // Reinicia la nota
  }

  eliminarNota(index: number) {
    this.materia.notas.splice(index, 1);
  }

  crearMateria() {
    this.materia.id = this.generateId();
    this.materiasService.addMateria(this.materia);
    this.router.navigate(['/lista-materias']);
  }
}
