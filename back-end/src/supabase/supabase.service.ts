import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    constructor() { }

    async uploadImage(fileName: string, buffer: Buffer){
        try {

            const supaBase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
            const uploadImage = await supaBase.storage.from("teste").upload(fileName, buffer, {
                upsert: true,
                contentType: "image/webp",
            })
            return uploadImage
        } catch (error) {

        }
    }

    async createSignedUrl(path: string, expires: number){
        try {

            const supaBase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
            const { data, error } = await supaBase.storage.from("teste").createSignedUrl(path, expires)
            return { data, error }

        } catch (error) {

            throw error;

        }
    }


}
