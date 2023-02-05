// @ts-nocheck
import { useSelectedTrain } from '../contexts/SelectedTrainContext';
import { AiOutlineClose } from 'react-icons/ai'
import styles from '../styles/SelectedTrainPopup.module.css'
import { useEffect, useState } from "react";
import TrainText from "./TrainText";
import { useRouter } from "next/router";

const SelectedTrainPopup = () => {

    const { selectedTrain, setSelectedTrain } = useSelectedTrain()


    const [avatar, setAvatar] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const router = useRouter();
    const { id, trainId } = router.query



    useEffect(() => {

        if (selectedTrain) getData()


        async function getData() {
            if (selectedTrain.TrainData.ControlledBySteamID) {
                let avatarRequest = await fetch('/api/profile?steamid=' + selectedTrain.TrainData.ControlledBySteamID);
                let profile: ProfileResponse = await avatarRequest.json();
                setAvatar(profile.avatarUrl)
                setUsername(profile.username)
            } else {
                setUsername("BOT")
                setAvatar(null)
            }
        }

        const interval = setInterval(() => {
            if (selectedTrain) getData()
        }, 30000)

        return () => clearInterval(interval)


    }, [selectedTrain])

    return (
        <>
            {selectedTrain && <div className={styles.popup}>
                <AiOutlineClose onClick={() => {
                    setSelectedTrain(null);
                    if (trainId) router.replace('/server/' + id);
                }} size={32} className={styles.closeButton} />
                <TrainText train={selectedTrain} username={username} avatar={avatar} /></div>
            }
        </>

    )
}

export default SelectedTrainPopup;
