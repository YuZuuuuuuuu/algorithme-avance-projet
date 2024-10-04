"use client";

import { getSession } from "@/utils/sessions";
// chargement du SDK Crisp
import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";


export default function le_sacrement_de_napoleon(){
    //Logique JS ici

    const userLogout = () => {
        // Reset de la session Crisp
        Crisp.session.reset();
        // Suppression du token Crisp pour arrêter le bot
        Crisp.setTokenId();
        // ... Ajouter votre propre logique ici
      };
  
      const userLogin = async () => {
          // ... Ajouter votre propre logique ici (récupératio du token de l'utilisateur connecté par exemple)
          const session = await getSession()
          // Configuration de Crisp (obligatoire pour utiliser le bot sur votre site)
          Crisp.configure(process.env.NEXT_PUBLIC_WEBSITE_ID || "", {
            autoload: false, // Si vous voulez afficher le bot immédiatement, passez à 'true' ici
          });
          Crisp.session.reset();
          // Récupération de l'historique d'une conversation Crisp
          Crisp.setTokenId(session.rowid);
          // Affichage du bot (utile uniquement si 'autoload: false' dans la configuration)
         Crisp.load();
          // Ouverture du bot
          Crisp.chat.open();
        };    
  
        const saveVisite = async () => {
          const now = new Date()
  
          const session = await getSession()
          console.log(session) 
  
          fetch("/api/visite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lastname: session.email,
              oeuvre: 'sacremen',
              horaire: now,
            }),
          });
        }
  
        useEffect(() => {
          userLogin();
          saveVisite()
        }, [])

      const showCarousel = () => {

        // Préparation d'un tableau pour le carousel (voir plus bas)
  const list = [
    {
    
      title: "Le radeau de la méduse",
      description: "Le Radeau de La Méduse est une peinture à l'huile sur toile, réalisée entre 1818 et 1819 par le peintre et lithographe romantique français Théodore Géricault.",
      actions: [
        {
          label: "Voir Détail",
          url: "/radeau_de_la_meduse",
        },
      ],  
    },
    {
      title: "Le sacre de Napoléon",
      description: "Le Sacre de Napoléon est un tableau peint entre 1805 et 1807 par Jacques-Louis David, peintre officiel de Napoléon Iᵉʳ, qui représente une des cérémonies du couronnement. Imposante par ses dimensions, presque dix mètres sur plus de six, la toile est conservée au Louvre. ",
      actions: [
        {
          label: "Voir Détail",
          url: "/le_sacrement_de_napoleon",
        },
      ],
    },
  ];
    // Affichage d'un carousel dans le bot
    Crisp.message.show("carousel", {
        text: "Voici la liste des oeuvres :",
        targets: list,
    });
    

      }
      const vote = () => {
        if (!sessionStorage.getItem("hasVoted")) {
          Crisp.message.show("text", "Vous avez upvote pour Le Sacrement de Napoléon."); 
          sessionStorage.setItem("hasVoted", "true");
        } else {
          Crisp.message.show("text", "Vous avez déjà voté."); 
        }
      };
      

      const saveVote = async (vote: string) => {
        const now = new Date()

        const session = await getSession()
        console.log(session) 

        fetch("/api/vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.email,
            oeuvre_id: 2,
            horaire: now,
          }),
        });
      }
    
      Crisp.message.onMessageReceived(
        (data: { content: { id: string; value: any } }) => {
          if (data.content.id == "oeuvre_de_votre_choix") {
            const vote = data.content.value;
            if (vote) { // Si ce n'est pas vide
              saveVote(vote);
              Crisp.message.offMessageReceived();
              return;
            }
            return;
          }
        }
      );

      const createTextArea = () => {
        Crisp.message.show("field", {
          id: "identifiant_de_votre_choix",
          text: "Quelle oeuvre voulez vous proposer ?",
          explain: "La joconde",
        });
      }

      const saveProposition = (proposition: string) => {
        // sauvegarde en base de la proposition
      }
    
      Crisp.message.onMessageReceived(
        (data: { content: { id: string; value: any } }) => {
          if (data.content.id == "identifiant_de_votre_choix") {
            const proposition = data.content.value;
            if (proposition) { // Si ce n'est pas vide
              saveProposition(proposition);
              Crisp.message.offMessageReceived();
              return;
            }
            return;
          }
        }
      );


      return (
        <>
           <h1>Le Sacrement de Napoléon</h1>
           <br></br>
           <br></br>
           <button><a href="/page1">Accueil</a></button>
             <br></br>
             <br></br>
             <button><a href="/mon-compte">Mon Compte</a></button>
             <br></br>
             <br></br>
             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, harum. Aut aliquam accusantium assumenda deleniti rerum ipsa ea, doloremque adipisci tenetur eveniet voluptatibus fuga ipsum accusamus sint unde explicabo! Eligendi.</p>
             <br></br>
             <img src="/sacre_de_napoleon_oeuvre.jpg" alt="le_sacrement_de_napoleon"/>
             
             <button onClick={vote}>Vote👍</button>
            
             <div id="textContainer"></div>
    <button onClick={createTextArea}>Proposition d'oeuvre</button>

        </>

        

        
        
      );

}
