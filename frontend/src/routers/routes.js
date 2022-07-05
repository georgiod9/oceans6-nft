import CommingSoonPage from "../pages/CommingSoonPage";
import MintingPage from "../pages/MintingPage";

export const routes = [
    {
        name: "Minting Page",
        exact: true,
        component: MintingPage,
        path: "",
        layout: "/",
        public: true,
    },
    {
        name: "Coming Soon",
        exact: true,
        component: CommingSoonPage,
        path: "",
        layout: "/coming-soon",
        public: true
    }
]