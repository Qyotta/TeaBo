package de.bht.swp.lao.ocp.utils;

import java.awt.Color;
import java.util.Random;

public class AssignmentHelper {
    public static Color generateColor(){
        Random random = new Random();
        return Color.getHSBColor(random.nextInt(359), 50, 100);
    }
}
