// Types pour les articles du blog
export interface Article {
  id: string | number;
  slug: string;
  title: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime?: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  featured?: boolean;
}

// Données simulées pour les articles
export const articles: Article[] = [
  {
    id: "1",
    slug: "un-nouveau-depart-apres-epreuve",
    title: "Un nouveau départ après l'épreuve",
    author: "Marie D.",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "12 juin 2023",
    readTime: "5 min",
    category: "Témoignages",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Marie nous partage comment sa foi l'a soutenue pendant une période difficile de sa vie, et comment elle a trouvé un nouveau départ grâce à sa confiance en Dieu et au soutien de la communauté chrétienne.",
    content: `
      <p>Il y a deux ans, ma vie a basculé lorsque j'ai perdu mon emploi et que des problèmes de santé sont apparus presque simultanément. Cette période a été l'une des plus sombres de ma vie. Je me souviens avoir ressenti un profond sentiment d'injustice et d'abandon.</p>
      
      <h2>Le moment du désespoir</h2>
      <p>Pendant plusieurs mois, j'ai lutté contre le désespoir. Mes prières semblaient rester sans réponse, et je ne comprenais pas pourquoi Dieu permettait tant d'épreuves dans ma vie. J'ai traversé des moments de doute intense, me demandant si ma foi avait un sens.</p>
      
      <blockquote>
        <p>"Même si je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi." (Psaume 23:4)</p>
      </blockquote>
      
      <p>Ce verset que j'avais appris depuis l'enfance a pris une toute nouvelle dimension pendant cette période. Il ne s'agissait plus simplement de belles paroles, mais d'une promesse à laquelle je pouvais m'accrocher.</p>
      
      <h2>Le soutien inattendu</h2>
      <p>C'est à ce moment que la communauté de l'église a joué un rôle crucial. Alors que je m'isolais de plus en plus, plusieurs personnes de l'assemblée sont venues vers moi. Sans jugement, elles m'ont offert leur écoute, leur temps, et parfois simplement leur présence silencieuse.</p>
    `,
    featured: true,
  },
  {
    id: "2",
    slug: "la-priere-qui-transforme",
    title: "La prière qui transforme",
    author: "Jean M.",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "5 juin 2023",
    readTime: "4 min",
    category: "Réflexions",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Comment la prière quotidienne peut transformer notre relation avec Dieu et renouveler notre perspective sur les défis que nous rencontrons...",
    content: `
      <p>La prière est souvent décrite comme une conversation avec Dieu. Mais qu'est-ce que cela signifie vraiment dans notre quotidien ? Comment passer d'une pratique religieuse à une véritable relation qui transforme notre vie ?</p>
      
      <h2>Au-delà des formules</h2>
      <p>Pendant longtemps, ma vie de prière se résumait à des formules apprises et répétées sans réelle conviction. Je priais parce que c'était ce qu'un bon chrétien devait faire, mais sans vraiment m'attendre à ce que quelque chose se passe.</p>
    `,
  },
  {
    id: "3",
    slug: "retour-journee-familiale",
    title: "Retour sur notre journée familiale",
    author: "L'équipe d'animation",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "29 mai 2023",
    readTime: "3 min",
    category: "Communauté",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Le week-end dernier, notre église s'est réunie pour une journée spéciale dédiée aux familles. Jeux, repas partagé et moments spirituels...",
    content: `
      <p>Le samedi 27 mai dernier, près de 80 personnes de tous âges se sont retrouvées pour notre journée familiale annuelle. Cet événement, devenu une tradition dans notre église, vise à renforcer les liens entre les générations et à offrir un espace de détente et de communion fraternelle.</p>
      
      <h2>Une journée sous le soleil</h2>
      <p>Dès 10h du matin, les premiers participants sont arrivés au parc de la Citadelle où était organisé l'événement. Malgré les prévisions incertaines, le soleil était au rendez-vous, ce qui a permis de profiter pleinement des activités en plein air.</p>
    `,
  },
  {
    id: "4",
    slug: "importance-communaute",
    title: "L'importance de la communauté",
    author: "Pasteur Thomas",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "22 mai 2023",
    readTime: "5 min",
    category: "Réflexions",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Pourquoi avons-nous besoin les uns des autres ? Réflexion sur l'importance de la communauté chrétienne dans notre croissance spirituelle...",
    content: `
      <p>Dans notre monde hyper-connecté mais paradoxalement marqué par un individualisme croissant, la question de la communauté revêt une importance particulière. Pourquoi est-il essentiel pour nous, chrétiens, de vivre notre foi en communauté ?</p>
      
      <h2>Une vérité fondamentale</h2>
      <p>L'être humain a été créé pour vivre en relation. Dès les premières pages de la Bible, Dieu déclare : "Il n'est pas bon que l'homme soit seul" (Genèse 2:18). Cette vérité fondamentale s'applique à tous les aspects de notre vie, y compris notre vie spirituelle.</p>
      
      <h2>La communauté dans le Nouveau Testament</h2>
      <p>Le modèle de l'Église primitive nous montre clairement l'importance de la vie communautaire. Dans le livre des Actes, nous voyons les premiers chrétiens "persévérer dans l'enseignement des apôtres, dans la communion fraternelle, dans la fraction du pain et dans les prières" (Actes 2:42).</p>
    `,
  },
  {
    id: "5",
    slug: "atheisme-a-la-foi",
    title: "De l'athéisme à la foi",
    author: "Paul L.",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "15 mai 2023",
    readTime: "6 min",
    category: "Témoignages",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Paul raconte son parcours spirituel, de l'athéisme convaincu à la découverte de la foi chrétienne. Un témoignage touchant sur la recherche de sens...",
    content: `
      <p>J'ai grandi dans une famille où la religion n'était jamais évoquée. Mes parents, tous deux scientifiques, m'ont transmis une vision du monde basée exclusivement sur la raison et l'observation empirique. J'ai donc naturellement adopté une position athée, considérant la foi comme une béquille psychologique pour les personnes incapables d'affronter la réalité.</p>
      
      <h2>Les questions existentielles</h2>
      <p>C'est à l'université, alors que j'étudiais la philosophie, que j'ai commencé à me poser des questions plus profondes. La lecture de penseurs comme Kierkegaard et Pascal m'a ouvert à une dimension que je n'avais jamais considérée : et si la raison seule ne suffisait pas à saisir toute la réalité ?</p>
    `,
  },
  {
    id: "6",
    slug: "preparation-camp-ete",
    title: "Préparation du camp d'été",
    author: "L'équipe jeunesse",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "8 mai 2023",
    readTime: "3 min",
    category: "Événements",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Les préparatifs du camp d'été pour les jeunes avancent bien ! Découvrez le thème, les activités prévues et comment inscrire vos enfants...",
    content: `
      <p>Chers parents et jeunes de l'église, nous sommes heureux de vous annoncer que les préparatifs pour notre camp d'été annuel avancent à grands pas ! Cette année, le camp se tiendra du 15 au 22 juillet dans le magnifique cadre des Vosges.</p>
      
      <h2>Le thème : "Héros de la foi"</h2>
      <p>Cette année, nous explorerons ensemble les histoires inspirantes des héros de la foi, ces hommes et femmes ordinaires qui ont accompli des choses extraordinaires grâce à leur confiance en Dieu. À travers des études bibliques adaptées à chaque tranche d'âge, des jeux, des activités créatives et des temps de partage, nous découvrirons comment leur exemple peut nous inspirer aujourd'hui.</p>
    `,
  },
  {
    id: "7",
    slug: "meditation-psaume-23",
    title: "Méditation sur le Psaume 23",
    author: "Pasteur Samuel",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "1 mai 2023",
    readTime: "4 min",
    category: "Réflexions",
    image: "/placeholder.svg?height=400&width=800",
    excerpt:
      "Une réflexion profonde sur l'un des passages les plus connus et aimés de la Bible. Comment ce psaume peut nous guider dans notre vie quotidienne...",
    content: `
      <p>Le Psaume 23 est peut-être le passage le plus connu et le plus aimé de toute la Bible. Même les personnes peu familières avec les Écritures reconnaissent souvent ses premiers mots : "L'Éternel est mon berger". Mais au-delà de sa popularité, ce psaume renferme une profondeur spirituelle qui mérite d'être explorée.</p>
      
      <h2>Un Dieu qui prend soin</h2>
      <p>La métaphore du berger évoque immédiatement l'image d'un Dieu attentif, qui prend soin de ses brebis. Dans l'Ancien Testament, les rois étaient souvent décrits comme des bergers pour leur peuple, et les mauvais dirigeants comme des bergers négligents.</p>
      
      <p>En déclarant "L'Éternel est mon berger", David affirme sa confiance personnelle en Dieu, qui veille sur lui comme un berger veille sur ses brebis. C'est une relation intime, pas simplement une vérité théologique abstraite.</p>
    `,
  }
]; 