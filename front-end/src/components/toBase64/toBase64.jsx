const ToBase64 = (file) => {
    
    if(file !== null){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);  // Lê o arquivo como URL de dados (Base64)
            reader.onload = () => resolve(reader.result);  // Retorna a string Base64 quando a leitura for concluída
            reader.onerror = (error) => reject(error);  // Retorna erro se falhar
        });
    }else{
        return null
    }
}

export default ToBase64;