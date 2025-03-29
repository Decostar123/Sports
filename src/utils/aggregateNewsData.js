export function aggregateByAuthor(newsData, authorKey) {
    const aggregateObj = newsData.reduce((acc, ele) => {
        const authorName = ele[authorKey];
        if (!authorName) return acc;
        if (!acc[authorName]) acc[authorName] = 0;
        acc[authorName] += 1;
        return acc;
    }, {});
    return aggregateObj;
}

export function aggregateBySource(newsData, sourceKey) {
    const aggregateObj = newsData.reduce((acc, ele) => {
        const sourceObj = ele.source;
        if (!sourceObj) return acc;
        const sourceName = sourceObj[sourceKey];
        if (!sourceName) return acc;
        if (!acc[sourceName]) acc[sourceName] = 0;
        acc[sourceName] += 1;
        return acc;
    }, {});
    return aggregateObj;
}