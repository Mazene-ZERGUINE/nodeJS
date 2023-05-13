import {Post, PostModel} from "../models/post.model";

export  async function insertPostes(): Promise<void> {
    const postArray: string[] = ["ADMIN" , "VISITEUR" , "VETERINAIRE" , "ACCUEIL" , "SOINGEUR" , "ENTRETIEN" , "VENDEUR"] ;
    
    const check = await PostModel.findAll();
    if (check.length > 0) {
        return;
    }
    
    try {
        postArray.forEach( async (post: string) => {
            const newPost = await PostModel.create({
                nom: post
            });
            console.log(newPost.toJSON());
        });
    } catch(error) {
        console.log("error ocuried while inserting roles : " , error) ;
    } 
}