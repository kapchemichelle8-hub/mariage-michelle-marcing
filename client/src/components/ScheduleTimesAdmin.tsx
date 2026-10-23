import { trpc } from "@/lib/trpc";
import { Clock3, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ScheduleValues = {
  civil: string;
  church: string;
  party: string;
};

const EVENT_FIELDS: Array<{
  id: keyof ScheduleValues;
  label: string;
  description: string;
}> = [
  { id: "civil", label: "Mariage civil", description: "Mairie" },
  { id: "church", label: "Bénédiction nuptiale", description: "Église" },
  { id: "party", label: "Soirée", description: "Hôtel Angelina" },
];

export default function ScheduleTimesAdmin() {
  const scheduleQuery = trpc.admin.getSchedule.useQuery(undefined, {
    retry: false,
  });
  const [values, setValues] = useState<ScheduleValues>({
    civil: "13:00",
    church: "15:00",
    party: "20:00",
  });

  useEffect(() => {
    if (scheduleQuery.data) setValues(scheduleQuery.data);
  }, [scheduleQuery.data]);

  const updateMutation = trpc.admin.updateSchedule.useMutation({
    onSuccess: async data => {
      setValues(data.schedule);
      await scheduleQuery.refetch();
      toast.success("Les horaires du programme ont été enregistrés.");
    },
    onError: error => toast.error(error.message || "Impossible d’enregistrer les horaires."),
  });

  const save = () => updateMutation.mutate(values);

  return (
    <section className="card-luxury rounded-3xl p-5 md:p-6 border border-[#ebdcc8]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#855f24] font-semibold">
            <Clock3 className="w-4 h-4" /> Réglage rapide
          </p>
          <h2 className="font-serif-luxury text-xl md:text-2xl font-bold mt-1 text-[#2d241e]">
            Horaires du programme
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Modifiez ici les heures affichées sur le site, le formulaire RSVP et les billets.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={scheduleQuery.isLoading || updateMutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer les horaires
        </button>
      </div>

      {scheduleQuery.error ? (
        <p className="rounded-xl bg-rose-50 text-rose-800 p-4 text-sm">
          Les horaires n’ont pas pu être chargés. Actualisez la page et réessayez.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EVENT_FIELDS.map(field => (
            <label
              key={field.id}
              className="rounded-2xl border border-[#ebdcc8] bg-[#fcfaf7] p-4"
            >
              <span className="block text-sm font-semibold text-[#2d241e]">{field.label}</span>
              <span className="block text-[11px] text-[#7c6d62] mt-0.5 mb-3">{field.description}</span>
              <input
                type="time"
                value={values[field.id]}
                onChange={event =>
                  setValues(previous => ({ ...previous, [field.id]: event.target.value }))
                }
                className="w-full rounded-xl border border-[#ebdcc8] bg-white px-3 py-2.5 text-base font-semibold text-[#5a4632] focus:outline-none focus:ring-2 focus:ring-[#c69a58]"
                aria-label={`Heure — ${field.label}`}
              />
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
