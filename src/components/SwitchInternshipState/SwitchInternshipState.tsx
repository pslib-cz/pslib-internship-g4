import React, { FC, useCallback } from "react";
import { Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  internshipStates,
  internshipStateTransitions,
  getInternshipStateLabel,
} from "../../data/lists";
import {
  InternshipFullRecord,
  InternshipWithCompanyLocationSetUser,
} from "../../types/entities";
import { InternshipState } from "@/types/data";

type SwitchInternshipStateProps = {
  internship: InternshipWithCompanyLocationSetUser | InternshipFullRecord;
  afterStateChange: (state: string) => void;
};

const SwitchInternshipState: FC<SwitchInternshipStateProps> = ({
  internship,
  afterStateChange,
}) => {
  let currentState: InternshipState = internship.state;
  let followingStates = internshipStateTransitions[currentState];
  const switchState = useCallback(
    (internshipId: string, state: InternshipState) => {
      fetch(`/api/internships/${internshipId}/state`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: state }),
      })
        .then((response) => response.json())
        .then((data) => {
          notifications.show({
            title: "Stav praxe byl změněn.",
            message: "Stav praxe byl úspěšně změněn.",
            color: "green",
          });
          afterStateChange(state.toString());
        })
        .catch((error) => {
          notifications.show({
            title: "Chyba",
            message: "Došlo k chybě při změně stavu praxe.",
            color: "red",
          });
        });
    },
    [afterStateChange],
  );
  return (
    <>
      <Text>
        Aktuální stav praxe je:{" "}
        <strong>{getInternshipStateLabel(internship.state.toString())}</strong>
      </Text>
      {followingStates.length === 0 ? (
        <Text>Toto je konečný stav.</Text>
      ) : (
        <>
          <Text>Další možné stavy jsou:</Text>
          <Group gap="sm" mt="sm">
            {followingStates.map((follow) => (
              <Button
                variant="default"
                key={follow.state}
                onClick={() => {
                  switchState(internship.id, follow.state);
                }}
              >
                {getInternshipStateLabel(follow.state.toString())}
              </Button>
            ))}
          </Group>
        </>
      )}
    </>
  );
};

export default SwitchInternshipState;
