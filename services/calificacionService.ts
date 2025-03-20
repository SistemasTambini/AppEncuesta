import api from './api';

import { Area } from '../models/Area';
import { Personal } from '../models/Personal';

// Obtener todas las áreas
export const getAreasCalificacion = async (): Promise<Area[]> => {
    try {
        const response = await api.get<Area[]>('/encuestas/areas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        throw error;
    }
};

// Obtener el personal según el área seleccionada
export const getPersonalByArea = async (id: number): Promise<Personal[]> => {
    try {
        const response = await api.get(`/encuestas/${id}`);
        return response.data.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            apellido: p.apellido,
        }));
    } catch (error) {
        console.error(`Error al obtener personal del área ${id}:`, error);
        throw error;
    }
};

export const sendSurvey = async (data: SurveyData): Promise<void> => {
    try {
        await api.post('/encuestas', data);
    } catch (error) {
        console.error('Error al enviar la encuesta:', error);
        throw error;
    }
};
