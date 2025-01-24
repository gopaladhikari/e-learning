import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z, type ZodSchema } from "zod";
import type { User } from "@/types";
import { Separator } from "../ui/separator";
import { useMutation } from "@tanstack/react-query";
import { updateUserMutation } from "@/lib/mutations/user.mutation";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/main";

type Props = {
  label: string;
  description: string;
  placeholder?: string;
  defaultValues?: Partial<User>;
  schema: ZodSchema;
  fieldName: keyof User;
};

type CachedUser = {
  data: User;
};

export function FormCard({
  label,
  description,
  placeholder,
  schema,
  fieldName,
  defaultValues,
}: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserMutation,
    mutationKey: ["update-user"],
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },

    onMutate: async (fieldName: Partial<User>) => {
      await queryClient.cancelQueries({
        queryKey: ["me"],
      });

      const oldUser = queryClient.getQueriesData({
        queryKey: ["me"],
      });

      const { data } = oldUser[0][1] as CachedUser;

      const newUser = {
        ...data,
        ...fieldName,
      };

      queryClient.setQueryData(["me"], {
        data: newUser,
      });
      return newUser;
    },

    onError: (_error, _fieldName, user) => {
      queryClient.setQueryData(["me"], {
        data: user,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  function onSubmit(data: Partial<User>) {
    mutate(data);
  }

  return (
    <>
      <Separator />
      <Card className="bg-background/50 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">{label}</FormLabel>
                  <FormDescription>{description}</FormDescription>
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
