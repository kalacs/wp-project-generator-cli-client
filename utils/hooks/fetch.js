import { memo } from "react";

const fetchHook = ({
    onSuccess,
    onLoad,
    onFailed,
    fetchData,
}) => {
    return () => {
        async function fetch() {
            try {
                onLoad(true);
                const response = await fetchData.call();
                onSuccess(response);
                onLoad(false);
            } catch (error) {
                onLoad(false);
                onSuccess(null);
                onFailed(error)
            }
        }
        fetch();
    };
}

export default fetchHook;


