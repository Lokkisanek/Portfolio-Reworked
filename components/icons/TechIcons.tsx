import { IconType } from 'react-icons';
import {
    SiBootstrap,
    SiCanva,
    SiCss3,
    SiHtml5,
    SiJavascript,
    SiLaravel,
    SiNodedotjs,
    SiReact,
} from 'react-icons/si';

const techIcons: Record<string, IconType> = {
    Html5: SiHtml5,
    HTML5: SiHtml5,
    Css3: SiCss3,
    CSS3: SiCss3,
    Javascript: SiJavascript,
    JavaScript: SiJavascript,
    React: SiReact,
    Nodejs: SiNodedotjs,
    'Node.js': SiNodedotjs,
    Node: SiNodedotjs,
    Canva: SiCanva,
    Laravel: SiLaravel,
    Bootstrap: SiBootstrap,
};

export default techIcons;
