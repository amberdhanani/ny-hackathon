import { useSetRecoilState } from "recoil";
import { transcriptsAtom } from "../recoil/atoms";
import { JSX, useCallback, useEffect } from "react";
import { TranscriptRecord } from "../types/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DBContext } from "../contexts/DBContext";

type Props = {
  children: JSX.Element;
};

export const DBProvider = ({ children }: Props) => {
  const setTranscripts = useSetRecoilState(transcriptsAtom);

  type DataLoaderPromises = [Promise<TranscriptRecord[]>];

  const fetchTranscripts = useCallback(async () => {
    const colRef = collection(db, "transcripts");
    const snapshot = await getDocs(colRef);
    const tempTranscripts = snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as TranscriptRecord),
    );
    const sortedTranscripts = tempTranscripts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sortedTranscripts;
  }, []);

  const getDataPromises = useCallback(() => {
    const dataLoaderPromises: DataLoaderPromises = [fetchTranscripts()];
    return dataLoaderPromises;
  }, [fetchTranscripts]);

  useEffect(() => {
    /*this function loads promises of all the data needed for when students log in into dataLoaderPromises
    and then awaits for all the data to be loaded and then sets the data into the recoil state*/

    const loadData = async () => {
      const dataLoaderPromises = getDataPromises();
      const results = await Promise.all(dataLoaderPromises);
      const [tempTranscripts] = results;
      setTranscripts(tempTranscripts);
    };
    loadData();
  }, [getDataPromises, setTranscripts]);

  return <DBContext.Provider value={null}>{children}</DBContext.Provider>;
};
