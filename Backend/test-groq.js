import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY?.trim();

console.log('🔑 API Key (primeros 20 chars):', apiKey?.substring(0, 20) + '...');
console.log('📏 Longitud de la key:', apiKey?.length);

async function testGroq() {
  try {
    console.log('\n🧪 Probando conexión con Groq API...\n');
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: 'Responde solo con un JSON: {"status": "ok", "mensaje": "funcionando"}'
          }
        ],
        temperature: 0.5,
        max_tokens: 100,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ ÉXITO! Groq API responde correctamente');
    console.log('📦 Respuesta:', response.data.choices[0].message.content);
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR al conectar con Groq:');
    console.error('Status:', error.response?.status);
    console.error('Detalle:', error.response?.data?.error?.message || error.response?.data);
    console.error('\n🔍 Verifica:');
    console.error('1. Que la API key sea válida en https://console.groq.com/keys');
    console.error('2. Que tengas créditos/cuota disponible');
    console.error('3. Que el modelo llama-3.3-70b-versatile esté habilitado');
    process.exit(1);
  }
}

testGroq();
