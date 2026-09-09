import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Suggestion } from '@/types/attendee.types';

export function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader>
        <CardTitle className="text-base">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{suggestion.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Save ~{suggestion.estimatedWaitDifferenceMinutes} mins wait time
          </span>
          <Button size="sm">Reroute Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
