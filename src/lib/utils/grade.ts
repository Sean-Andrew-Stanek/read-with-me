import type { User, ChildUser } from '@/lib/types/user';

type GradeFields = { grade?: unknown; difficultyGrade?: unknown };

const convertToNumber = (gradeValue: unknown, defaultGrade: number): number => {
    if (typeof gradeValue === 'number' && Number.isFinite(gradeValue)) {
        return gradeValue;
    }
    if (typeof gradeValue === 'string') {
        const parsedGrade = Number.parseInt(gradeValue, 10);
        if (Number.isFinite(parsedGrade)) {
            return parsedGrade;
        }
    }
    return defaultGrade;
};

// difficulty from reading, if not exists then use academic grade level
export const getNumericGrade = (
    userRecord: User | ChildUser | null
): number => {
    if (!userRecord) return 6;

    const userGrades = userRecord as GradeFields;

    if (userGrades.difficultyGrade != null) {
        return convertToNumber(userGrades.difficultyGrade, 6);
    }

    return convertToNumber(userGrades.grade, 6);
};
