import { useEffect, useState } from "react";
import Hero from "../game/entities/Hero";

type Props = {
    hero: Hero;
};

function HeroForm({hero}: Props) {
    const [heroSpeed, setHeroSpeed] = useState<number>(Math.abs(hero.direction.y));
    const [attackSpeed, setAttackSpeed] = useState<number>(Math.abs(hero.abilities[0].meta.speed as number));
    const [cooldown, setCooldown] = useState<number>(Math.abs(hero.abilities[0].cooldown as number));

    const updateHeroSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number((e.target as HTMLInputElement).value);
        const sign = Math.sign(hero.direction.y) || 1;
        
        hero.direction.y = value * sign;
        setHeroSpeed(value);
    };

    const updateAttackSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number((e.target as HTMLInputElement).value);
        
        hero.abilities[0].meta.speed = value;
        setAttackSpeed(value);
    }; 

    const updateCooldown = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number((e.target as HTMLInputElement).value);
        
        hero.abilities[0].cooldown = value;
        setCooldown(value);
    };  

    useEffect(() => {
        setHeroSpeed(Math.abs(hero.direction.y));
        setAttackSpeed(Math.abs(hero.abilities[0].meta.speed as number));
        setCooldown(Math.abs(hero.abilities[0].cooldown as number));
    }, [hero])

    return (
        <form>
            <h3>Hero {hero.name || hero.id}</h3>

            <div>
                <label htmlFor="speed">Moving speed:</label>
                <input id="speed" type="range" min="0" max="3000" name="speed" value={heroSpeed} onChange={updateHeroSpeed} />
                {heroSpeed}
            </div>

            <div>
                <label htmlFor="atk-speed">Cooldown:</label>
                <input id="atk-speed" type="range" step="0.01" min="0" max="15" name="atk-speed" value={cooldown} onChange={updateCooldown} />
                {cooldown}
            </div>

            <div>
                <label htmlFor="atk-speed">Bullet speed:</label>
                <input id="atk-speed" type="range" min="0" max="3000" name="atk-speed" value={attackSpeed} onChange={updateAttackSpeed} />
                {attackSpeed}
            </div>

        </form>
    );
}

export default HeroForm;