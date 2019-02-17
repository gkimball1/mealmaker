package com.example.mealmaker;


import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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

        SharedPreferences prefs = getActivity().getSharedPreferences(PREFS_FILE, MODE_PRIVATE);

        int calories = prefs.getInt("calories", 0);
        double fatG = (0.25*calories)/9;
        double carbG = (0.45*calories)/4;
        double protG = (0.35*calories)/4;

        tv1.setText("Hey there! At a"+activity(prefs.getFloat("activity", 0))+
                " exercise level, your daily energy expenditure is " +prefs.getInt("calories", 0)+" calories per day.");

        tv2.setText("Those calories break down as follows, following the 25/45/30 percent rule of fat/carb/protein calorie intake. \n" +
                "Fat: "+(0.25*calories)/9+" g\n"+
                "Carbohydrates: "+(0.45*calories)/4+" g\n"+
                "Protein: "+(0.35*calories)/4+" g\n");


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

    // fat: 2.5/10*calories
    // carbs: 4.5/10*calories
    // protein: 3/10*calories

}
