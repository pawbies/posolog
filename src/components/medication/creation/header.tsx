import { Fragment } from "react";
import { Text, View } from "react-native";

const GREEN_DARK = "#56972b";

const STEPS = [
  { number: 1, label: "Basic information" },
  { number: 2, label: "Ingredients" },
  { number: 3, label: "Kinetics" },
];

type Props = {
    currentStep: number;
}

export default function Header({ currentStep }: Props) {
  return (
    <View className="mt-8 mb-6 flex-row items-start px-2">
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep;
        const isComplete = step.number < currentStep;
        const isFilled = isActive || isComplete;

        return (
          <Fragment key={step.number}>
            <View className="items-center" style={{ width: 84 }}>
              <View
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isFilled ? GREEN_DARK : undefined,
                }}
              >
                {!isFilled && (
                  <View className="w-9 h-9 rounded-full absolute bg-gray-200 dark:bg-neutral-800" />
                )}
                <Text
                  className={
                    isFilled
                      ? "text-sm font-bold text-white"
                      : "text-sm font-bold text-gray-500 dark:text-neutral-400"
                  }
                >
                  {step.number}
                </Text>
              </View>
              <Text
                className={
                  isActive
                    ? "mt-2 text-xs font-semibold text-center text-black dark:text-white"
                    : "mt-2 text-xs text-center text-gray-400 dark:text-neutral-500"
                }
                numberOfLines={2}
              >
                {step.label}
              </Text>
            </View>

            {index < STEPS.length - 1 && (
              <View
                className="flex-1 h-0.5 rounded-full"
                style={{
                  marginTop: 18,
                  backgroundColor: isComplete
                    ? GREEN_DARK
                    : undefined,
                }}
              >
                {!isComplete && (
                  <View className="flex-1 h-0.5 rounded-full bg-gray-200 dark:bg-neutral-800" />
                )}
              </View>
            )}
          </Fragment>
        );
      })}
    </View>
  );
}