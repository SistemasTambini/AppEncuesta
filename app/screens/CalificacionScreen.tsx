import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native'; // 🔹 Importa Alert
import { Area } from '@/models/Area';
import { Personal } from '@/models/Personal';
import { getAreasCalificacion, getPersonalByArea, sendSurvey } from '@/services/calificacionService';
//import {Toast} from 'react-native-toast-message';

type QuestionKey = 'clarity' | 'responseTime' | 'professionalism' | 'time' | 'recommendation' | 'atu1' | 'atu2' | 'general';

export default function CalificacionScreen() {
    const router = useRouter();
    //const [selectedArea, setSelectedArea] = useState<'protocolar' | 'extraprotocolar' | ''>('');
    //const [selectedPerson, setSelectedPerson] = useState('');
    const [clienteNombre, setClienteNombre] = useState('');
    const [areas, setAreas] = useState<Area[]>([]);
    const [personal, setPersonal] = useState<Personal[]>([]);
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    const [selectedPerson, setSelectedPerson] = useState('');
    const [loadingAreas, setLoadingAreas] = useState(true);
    const [loadingPersonal, setLoadingPersonal] = useState(false);

    const [responses, setResponses] = useState<Record<QuestionKey, number | null>>({
        clarity: null,
        responseTime: null,
        professionalism: null,
        time: null,
        recommendation: null,
        atu1: null,
        atu2: null,
        general: null,
    });


    const satisfactionLevels = [
        { value: '1', label: 'Muy Insatisfecho', color: 'red', icon: 'sentiment-very-dissatisfied' },
        { value: '2', label: 'Insatisfecho', color: 'orange', icon: 'sentiment-dissatisfied' },
        { value: '3', label: 'Neutral', color: 'yellow', icon: 'sentiment-neutral' },
        { value: '4', label: 'Satisfecho', color: 'lightgreen', icon: 'sentiment-satisfied' },
        { value: '5', label: 'Muy Satisfecho', color: 'green', icon: 'sentiment-very-satisfied' },
    ] as const; // 🔹 `as const` evita mutaciones

    const questions: { key: QuestionKey; label: string }[] = [
        { key: 'clarity', label: '¿Cómo calificaría la claridad en la explicación de su caso?' },
        { key: 'responseTime', label: '¿El abogado respondió de manera oportuna y resolvió sus dudas?' },
        { key: 'professionalism', label: '¿Cómo evaluaría el nivel de profesionalismo del abogado?' },
        { key: 'time', label: '¿Qué tan satisfecho está con el tiempo de respuesta y resolución de su trámite?' },
        { key: 'recommendation', label: '¿Recomendaría este servicio a alguien más?' }, // 📌 Asegurar que está bien definido
        { key: 'atu1', label: '¿Cómo calificaría la atención recibida a través de llamadas y WhatsApp?' },
        { key: 'atu2', label: '¿Cómo evalúa el trato recibido por parte del personal?' },
        { key: 'general', label: '¿Cuál es su percepción general sobre el servicio brindado?' },
    ];
    

    // ✅ Modificado para evitar el desmarcado accidental
    const handleSelection = (questionKey: QuestionKey, value: number) => {
        console.log(`🔹 Pregunta: ${questionKey}, Valor seleccionado: ${value}`); // 🔍 Verifica si se está guardando
    
        setResponses((prev) => {
            const newResponses = {
                ...prev,
                [questionKey]: prev[questionKey] === value ? null : value, // Permite desmarcar si el usuario toca la misma opción
            };
    
            //console.log('📝 Nuevo estado de responses:', newResponses); // 🔍 Verifica si el estado se actualiza bien
            return newResponses;
        });
    };

    // ✅ Validación correcta de todas las preguntas y recomendación
    const validateSurvey = () => {
        if (!clienteNombre.trim()) {
            alert('Debe ingresar el nombre del cliente.');
            return false;
        }
        if (!selectedArea) {
            alert('Debe seleccionar un área.');
            return false;
        }
        if (!selectedPerson) {
            alert('Debe seleccionar un asesor.');
            return false;
        }
        for (const { key, label } of questions) {
            if (responses[key] === null) {
                alert(`Falta seleccionar una opción en: "${label}"`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateSurvey()) return;
    
        const surveyData = {
            nombre_cliente: clienteNombre,
            area: areas.find((area) => area.id === selectedArea)?.nombre || 'Desconocido', // 🔹 Nombre del área
            asesor: personal.find((p) => p.id === Number(selectedPerson))?.nombre || 'Desconocido', // 🔹 Nombre del asesor
            pregunta1: responses.clarity ?? 0, // 🔹 Asegura que no sea null
            pregunta2: responses.responseTime ?? 0,
            pregunta3: responses.professionalism ?? 0,
            pregunta4: responses.time ?? 0,
            pregunta5: responses.recommendation ?? 0,
            pregunta6: responses.atu1 ?? 0,
            pregunta7: responses.atu2 ?? 0,
        };
    
        console.log('🚀 Enviando datos:', JSON.stringify(surveyData, null, 2));
    
        try {
            const response = await sendSurvey(surveyData);
            console.log('✅ Respuesta del servidor:', response);
    
            Alert.alert('Encuesta enviada', 'Gracias por tu respuesta', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') },
            ]);
        } catch (error: any) {
            console.error('❌ Error al enviar la encuesta:', error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo enviar la encuesta. Verifica los datos.');
        }
    };
    



    useEffect(() => {
        // Cargar áreas al inicio
        const fetchAreas = async () => {
            try {
                const data = await getAreasCalificacion();
                setAreas(data);
            } catch (error) {
                console.error('Error obteniendo áreas:', error);
            } finally {
                setLoadingAreas(false);
            }
        };
        fetchAreas();
    }, []);

    useEffect(() => {
        // Cargar personal cuando cambie el área seleccionada
        if (selectedArea !== null) {
            setLoadingPersonal(true);
            getPersonalByArea(selectedArea)
                .then(setPersonal)
                .catch((error) => console.error('Error obteniendo personal:', error))
                .finally(() => setLoadingPersonal(false));
        } else {
            setPersonal([]);
        }
    }, [selectedArea]);

    // ✅ Asegurar que `getDynamicLabel()` siempre devuelva un string sin elementos extraños
    const getDynamicLabel = (label: string): string => {
        if (!label) return ''; // 🔹 Previene errores si `label` es `undefined` o `null`

        return selectedArea === 2 // ✅ Compara con el ID del área en lugar del nombre
            ? label.replace(/\babogado\b/gi, 'asesor(a)') // 🔹 Asegura que solo cambia la palabra exacta "abogado"
            : label;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Encuesta de Calificación de Servicio</Text>


            <Text style={styles.label}>Cliente (Nombre o Razón Social)</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingrese su nombre o razón social"
                value={clienteNombre}
                onChangeText={setClienteNombre}
            />

            {/* Selección de Área */}
            <Text style={styles.label}>Selecciona Área</Text>
            {loadingAreas ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Picker
                    selectedValue={selectedArea}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setSelectedArea(itemValue);
                        setSelectedPerson('');
                    }}>
                    <Picker.Item label="Seleccionar" value={null} />
                    {areas.map((area) => (
                        <Picker.Item key={area.id} label={area.nombre} value={area.id} />
                    ))}
                </Picker>
            )}

            {selectedArea !== null && (
                <>
                    <Text style={styles.label}>Selecciona Personal</Text>
                    {loadingPersonal ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Picker selectedValue={selectedPerson} style={styles.picker} onValueChange={setSelectedPerson}>
                            <Picker.Item label="Seleccionar" value="" />
                            {personal.map((p) => (
                                <Picker.Item key={p.id} label={`${p.nombre} ${p.apellido}`} value={p.id} />
                            ))}
                        </Picker>
                    )}
                </>
            )}

            {/* Mostrar preguntas y botón solo si se seleccionó personal */}
            {selectedPerson && (
                <>
                    {/* Preguntas de satisfacción con cambio dinámico */}
                    {questions.map(({ key, label }) => (
                        <View key={key} style={styles.card}>
                            {/* ✅ Solución: Asegurar que `Text` siempre contenga un string limpio */}
                            <Text style={styles.question}>{getDynamicLabel(label)}</Text>
                            <View style={styles.emojiContainer}>
                                {satisfactionLevels.map(({ value, label, color, icon }) => (
                                    <TouchableOpacity
                                    key={value}
                                    style={[styles.emoji, responses[key] === Number(value) && styles.selectedEmoji]}
                                    onPress={() => handleSelection(key, Number(value))} // Convertimos a número antes de pasarlo
                                >
                                    <MaterialIcons name={icon} size={35} color={color} />
                                    <Text style={{ color, fontSize: 6, textAlign: 'center' }}>{label}</Text>
                                </TouchableOpacity>
                                
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Botones */}
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={() => router.back()} style={styles.blackButton}>
                            Volver
                        </Button>
                        <Button mode="contained" onPress={handleSubmit} style={styles.blackButton}>
                            <Text style={styles.buttonText}>Finalizar</Text>
                        </Button>
                    </View>
                </>
            )}
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F5DC',
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    picker: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    emoji: {
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#FFF',
    },
    selectedEmoji: {
        backgroundColor: '#D3D3D3',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    blackButton: {
        backgroundColor: 'black',
    },
    radioContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    radioOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonText: {  // 🔹 Agregado para evitar el error
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        //borderColor: '#ccc',
        //borderWidth: 1,
        //borderRadius: 5,        
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        marginBottom: 20,
    },
});
