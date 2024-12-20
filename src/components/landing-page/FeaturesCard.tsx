import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

type Props = {
  header: string;
  body: string;
};

const FeaturesCard = (props: Props) => {
  return (
    <Card className="w-[100%] my-4 md:w-80 bg-subsidiary/50 border border-principal py-5 text-white hover:bg-principal hover:text-textPrincipal">
      <CardHeader className="font-semibold text-2xl">{props.header}</CardHeader>
      <CardContent>{props.body}</CardContent>
    </Card>
  );
};

export default FeaturesCard;
