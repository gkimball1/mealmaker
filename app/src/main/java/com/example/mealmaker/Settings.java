package com.example.mealmaker;


import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import static android.content.Context.MODE_PRIVATE;


/**
 * A simple {@link Fragment} subclass.
 */
public class Settings extends Fragment {
    public static final String PREFS_FILE = "user_data";


    public Settings() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_settings, container, false);
        TextView tv1 = (TextView) rootView.findViewById(R.id.calories);
        TextView tv2 = (TextView) rootView.findViewById(R.id.nutrients);
        TextView tv3 = (TextView) rootView.findViewById(R.id.remainder);
        Button btn = rootView.findViewById(R.id.infoedit);

        SharedPreferences prefs = getActivity().getSharedPreferences(PREFS_FILE, MODE_PRIVATE);

        int calories = prefs.getInt("calories", 0);
        int calEaten = prefs.getInt("eaten", 0);
        int fatG = (int) (0.25*calories)/9;
        int carbG = (int) (0.45*calories)/4;
        int protG = (int) (0.30*calories)/4;

        tv1.setText("Hey there! At a"+activity(prefs.getFloat("activity", 0))+
                " exercise level, your daily energy expenditure is " +prefs.getInt("calories", 0)+" calories per day.");

        tv2.setText("Those calories break down like so, following the 25/45/30 percent rule of fat/carb/protein calorie intake: \n\n" +
                "Fat: "+fatG+" g\n"+
                "Carbohydrates: "+carbG+" g\n"+
                "Protein: "+protG+" g\n");

        if( calEaten >= prefs.getInt("calories", 0) ) {
            tv3.setText("Looks like you've eaten your fill today! If you're still hungry, " +
                    "vegetables are a great way to fill up while keeping your calorie count low.");
        }
        else if( calEaten < prefs.getInt("calories", 0) - 100 ){
            tv3.setText("It looks like you still need "+(calEaten-calories)+" calories to fulfill your daily requirement.");
        }
        else {
            tv3.setText("It seems like you're almost at your daily limit. If you want to, eat a light snack like fruit or nuts.");
        }

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), userInput.class);
                startActivity(intent);
            }
        });

        return rootView;
    }

    private String activity(double level) {
        String lev = "";
        // multiplier goes from 1.2 (sedentary) to 1.9 (extremely active)
        if (level <= 1.3) lev = " sedentary";
        else if (level <= 1.5 ) lev = " moderate";
        else if (level <= 1.7 ) lev = "n active";
        else lev = " extreme";
        return lev;
    }

    private String remain(int cur, int goal, String nutrient) {
        return "";
    }

    // fat: 2.5/10*calories
    // carbs: 4.5/10*calories
    // protein: 3/10*calories

}
