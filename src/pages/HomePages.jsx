import Hero from "../components/Hero";
import Separator from "../components/Separator";
import Carousel from "../components/Carousel";
import ReviewsSection from "../components/ReviewsSection";

export default function HomePage() {
    return (
        <>
            

            <Hero />
            <Separator thickness="2px" />

            <Carousel
                title="Népszerű a héten"
                movies={[
                    { id: 1, title: "JAWS", poster: "/jaws.jpg" },
                    { id: 2, title: "JAWS", poster: "/jaws.jpg" },
                    { id: 3, title: "JAWS", poster: "/jaws.jpg" },
                    { id: 4, title: "JAWS", poster: "/jaws.jpg" },
                    { id: 5, title: "JAWS", poster: "/jaws.jpg" },
                    { id: 6, title: "JAWS", poster: "/jaws.jpg" },
                ]}
            />

            <Carousel
                title="Közelgő Filmek"
                movies={[
                    { id: 1, title: "FNAF 2", poster: "/fnaf2.jpg" },
                    { id: 2, title: "FNAF 2", poster: "/fnaf2.jpg" },
                    { id: 3, title: "FNAF 2", poster: "/fnaf2.jpg" },
                    { id: 4, title: "FNAF 2", poster: "/fnaf2.jpg" },
                    { id: 5, title: "FNAF 2", poster: "/fnaf2.jpg" },
                    { id: 6, title: "FNAF 2", poster: "/fnaf2.jpg" },
                ]}
            />
        <ReviewsSection />
        
        </>
        
        
    );
}
