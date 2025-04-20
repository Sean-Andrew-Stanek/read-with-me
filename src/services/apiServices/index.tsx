import { putUserGradeURI } from '@/config/apiUri';

export const putUserGrade = async (
    grade: string,
    uuid: string
): Promise<void> => {
    try {
        await fetch(putUserGradeURI(), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid,
                grade
            })
        });
    } catch (error) {
        throw new Error(`Failed to save grade: ${error}`);
    }
};
