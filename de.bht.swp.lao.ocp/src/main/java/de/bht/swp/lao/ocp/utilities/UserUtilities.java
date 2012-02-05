package de.bht.swp.lao.ocp.utilities;

/**
 * provides helpers for the userobjects
 * 
 */
public class UserUtilities {
  private static final int PASS_LENGTH = 10;

  /**
   * generates a random password with the default length defined
   * in<i>PASS_LENGTH</i>
   * 
   * @return
   */
  public static String randomPassword() {
    String allchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    char[] chars = allchars.toCharArray();
    StringBuilder password = new StringBuilder();
    for (int i = 0; i < PASS_LENGTH; i++) {
      password.append(chars[(int) Math.round(Math.random() * (chars.length - 1))]);
    }
    return password.toString();
  }

  /**
   * generates a random password with length as defined
   * 
   * @param length
   * @return
   */
  public static String randomPassword(int length) {
    String allchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    char[] chars = allchars.toCharArray();
    StringBuilder password = new StringBuilder();
    for (int i = 0; i < length; i++) {
      password.append(chars[(int) Math.round(Math.random() * (chars.length - 1))]);
    }
    return password.toString();
  }
}
