const baseApiUri =
    process.env.REACT_APP_API_URL || 'http://localhost:8080/api/';

export const putUserGradeURI = (): string => `${baseApiUri}/user`;
