import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { MateriasService } from '../../services/materias.service.service';
import { Materia, Nota } from '../../models/models';

@Component({
  selector: 'app-detalle-materia',
  templateUrl: './detalle-materia.page.html',
  styleUrls: ['./detalle-materia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetalleMateriaPage implements OnInit {
  materia: Materia | undefined;
  searchTerm: string = '';
  promedioNotas: { [key: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
  };
  promedioTotal: number = 0; // Asegúrate de que esta propiedad esté aquí
  constructor(
    private materiasService: MateriasService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  buscarMateria() {
    this.materia = this.materiasService.getMateriaByName(this.searchTerm);
    if (this.materia) {
      // Calcula el promedio total usando el servicio y lo asigna a la variable promedioTotal
      this.promedioTotal = this.materiasService.calcularPromedioMateria(this.materia);
    } else {
      // Reinicia el promedio total si no encuentra la materia
      this.promedioTotal = 0;
    }
  }

  calcularPromedioNotas() {
    if (this.materia) {
      const cortes = [1, 2, 3, 4];  // 1: Primer 20%, 2: Segundo 20%, 3: Tercer 20%, 4: 40% Final
      cortes.forEach(corte => {
        const notasCorte = this.materia!.notas.filter(nota => nota.corte === corte);
        const total = notasCorte.reduce((sum, nota) => sum + nota.nota, 0);
        const promedio = notasCorte.length > 0 ? total / notasCorte.length : 0;
        this.promedioNotas[corte] = promedio;
      });
    }
  }
  async confirmDeleteNota(nota: Nota) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteNota(nota)
        }
      ]
    });
    await alert.present();
  }
  
  deleteNota(nota: Nota) {
    if (this.materia) {
      const index = this.materia.notas.indexOf(nota);
      if (index > -1) {
        this.materia.notas.splice(index, 1);
        this.materiasService.saveMaterias();
      }
    }
  }
  editarMateria() {
    if (this.materia) {
      this.materiasService.updateMateria(this.materia);  // Actualiza la materia en el servicio
      alert('Materia actualizada correctamente');
    }
  }

  async editarNota(nota: Nota, index: number) {
    const alert = await this.alertController.create({
      header: 'Editar Nota',
      inputs: [
        {
          name: 'nota',
          type: 'number',
          value: nota.nota.toString(),  // Asegúrate de convertir a string
          placeholder: 'Ingrese la nueva nota',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (this.materia && data.nota !== undefined) {
              // Actualiza la nota en el array usando el índice
              this.materia.notas[index].nota = parseFloat(data.nota);
              // Actualiza la materia en el servicio
              this.materiasService.updateMateria(this.materia);
              // Recalcula el promedio total
              this.promedioTotal = this.materiasService.calcularPromedioMateria(this.materia);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
